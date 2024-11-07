from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext 
from typing import Annotated, List
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

model = joblib.load("./../models/agent.pkl")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


origins = [
  "http://localhost",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
  )

class Transaction(BaseModel):
  amount: float
  category: str
  description: str
  is_income: bool
  date: str
  
  
class TransactionModel(BaseModel):
  id: int
  
  class Config:
    orm_mode = True
    
class UserCreate(BaseModel):
  username: str
  password: str
  
class TokenData(BaseModel):
    username: str
    
class User(BaseModel):
  id: int
  username: str
    
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
    

    
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

#Transactions

@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: Transaction, db: db_dependency):
  db_transaction = models.Transaction(**transaction.dict())
  db.add(db_transaction)
  db.commit()
  db.refresh(db_transaction)
  return db_transaction

@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
  return db.query(models.Transaction).offset(skip).limit(limit).all()


#Create User
def get_user_by_username(username: str, db: db_dependency):
  return db.query(models.User).filter(models.User.username == username).first()

def create_user(user: UserCreate, db: db_dependency):
  hashed_password = pwd_context.hash(user.password)
  db_user = models.User(username=user.username, hashed_password=hashed_password)
  db.add(db_user)
  db.commit()
  db.refresh(db_user)
  return db_user

@app.post('/register/')
def register(user: UserCreate, db: Session = Depends(get_db)):
  db_user = get_user_by_username(user.username, db)
  if db_user:
    raise HTTPException(status_code=400, detail="Username already exists")
  return create_user(user, db)

#Login
def authenticate_user(username: str, password: str, db: Session):
  user = get_user_by_username(username, db)
  if not user:
    return False
  if not pwd_context.verify(password, user.hashed_password):
    return False
  return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt

@app.post('/token/')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  user = authenticate_user(form_data.username, form_data.password, db)
  if not user:
    raise HTTPException(
      status_code=401,
      detail="Incorrect username or password",
      headers={"WWW-Authenticate": "Bearer"},
    )
  access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(
    data={"sub": user.username}, expires_delta=access_token_expires
  )
  return {"access_token": access_token, "token_type": "bearer", "username": user.username}

#Verify Token
def verify_token(token: str = Depends(oauth2_scheme)):
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")
    if username is None:
      raise HTTPException(status_code=403, detail="Token is invalid or expired")
    return payload
  except JWTError:
    raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get('/verify-token/{token}')
async def verify_user_token(token: str):
  verify_token(token)
  return {"message": "Token is valid"}


#Agent
class PredictionRequest(BaseModel):
    tax_base_basic: float
    tax_base_reduced: float
    vat_amount_basic: float
    vat_amount_reduced: float
    price: float
    vat_rate: float

class PredictionResponse(BaseModel):
    predicted_total_price: float
    
@app.post("/predict/", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        features = np.array([[request.tax_base_basic, request.tax_base_reduced, 
                              request.vat_amount_basic, request.vat_amount_reduced, 
                              request.price, request.vat_rate]])
        predicted_total_price = model.predict(features)[0]
        return PredictionResponse(predicted_total_price=predicted_total_price)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

