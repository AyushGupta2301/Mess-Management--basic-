import requests
import random
import json

for i in range(0,50):
    did = "Dish " + str(i)
    ingre = {}
    for i in range(1,random.randint(2,9)):
        ingre["Ingredient " + str(random.randint(1,20))] = random.randint(1,50)
    resp = requests.post('http://127.0.0.1:8081/new_dish',json={"Dish": did, "ingredients": ingre})
    print(resp.text)