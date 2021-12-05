import requests

message ="Hello \n Sir" 
paramperson = {'chat_id':'1158109698','text':message,'parse_mode':'HTML'}
resp = requests.post('https://api.telegram.org/bot2133097358:AAFLewQeNHQysJS6sOIJ0L1ZMRuSX-rNTc8/sendMessage',params=paramperson)