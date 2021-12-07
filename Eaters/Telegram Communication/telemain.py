from telegram.ext.updater import Updater
from telegram.update import Update
from telegram.ext.callbackcontext import CallbackContext
from telegram.ext.commandhandler import CommandHandler
from telegram.ext.messagehandler import MessageHandler
from telegram.ext.filters import Filters
import requests
  
updater = Updater("2133097358:AAFLewQeNHQysJS6sOIJ0L1ZMRuSX-rNTc8", use_context=True)
  
  
def atten(update: Update, context: CallbackContext):
    resp = requests.post('http://127.0.0.1:8081/atten_put',json={"studID":"Student265","attentype":"tenAtten","value":1})
    if(resp.status_code==200):
        update.message.reply_text("Your Attendance has been Posted")
    else:
        update.message.reply_text("There might be a connection problem, please post the attendance through our Website..")
  
def substi(update: Update, context: CallbackContext):
    resp = requests.post('http://127.0.0.1:8081/atten_put',json={"studID":"Student265","attentype":"spAtten","value":1})
    if(resp.status_code==200):
        update.message.reply_text("Your Share is ready for Substitution")
  
   
updater.dispatcher.add_handler(CommandHandler('Attend', atten))
updater.dispatcher.add_handler(CommandHandler('Substitute', substi))
updater.start_polling()