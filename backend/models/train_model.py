import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression  
from sklearn.metrics import accuracy_score
import pickle
import joblib
from sklearn.metrics import mean_squared_error
from sklearn.impute import SimpleImputer



# print("Receipts")
# data = pd.read_csv('D:/react/2024/erste_hackathon/backend/models/datasets/Receipts.csv')
# print(data.columns)
# data = pd.read_csv('D:/react/2024/erste_hackathon/backend/models/datasets/Products.csv')
# print("Products")
# print(data.columns)

# data = pd.read_csv('D:/react/2024/erste_hackathon/backend/models/datasets/ProductCategory.csv')
# print("ProductCategory")
# print(data.columns)

# data = pd.read_csv('D:/react/2024/erste_hackathon/backend/models/datasets/Organizations.csv')
# print("Organizations")
# print(data.columns)

# data = pd.read_csv('D:/react/2024/erste_hackathon/backend/models/datasets/UsersClean.csv')
# print("UsersClean")
# print(data.columns)
receipts_df = pd.read_csv('./backend/models/datasets/Receipts.csv')
products_df = pd.read_csv('./backend/models/datasets/Products.csv')

receipts_data = receipts_df[['id', 'tax_base_basic', 'tax_base_reduced', 'vat_amount_basic', 'vat_amount_reduced', 'total_price']]
products_data = products_df[['id', 'price', 'vat_rate', 'category']]

data = pd.merge(receipts_data, products_data, on='id')

X = data[['tax_base_basic', 'tax_base_reduced', 'vat_amount_basic', 'vat_amount_reduced', 'price', 'vat_rate']]
y = data['total_price']

imputer = SimpleImputer(strategy='mean')  
X = imputer.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

joblib.dump(model, "./backend/models/agent.pkl")

