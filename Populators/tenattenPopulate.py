import requests
import random

for i in range(0,500):
    id = "Student" + str(i)
    resp = requests.post('http://127.0.0.1:8081/atten_put',json={"studID": id ,"attentype":"tenAtten","value":random.randint(0,1)})
    print(resp.text)