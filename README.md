# Annapurna
Annapurna is a Web Based Real-Time Mess Management System with advanced features like Fully Flexible Menu, Tentative attendance, Ingredient List based on tentative attendance, Penalties for defaulters and Substitution of food. 
- Uses Node.js in the backend, jQuery AJAX as the middleware,  MySQL and MongoDB as the databases. 

Annapurna facilitates both the eaters and the feeders.
## For Feeders:
- Set menu for each day, this ensures flexiblity of the menu over various conditions like the availablity of the ingredients
- Get the tentative ingredient list based on the tentative attendance, this ensures the efficient use of the inventory
- Get real-time statistics of the ongoing mess session -- Actual Attendance, Substitution Table
- Issue the penalties for the defaulters -- who marked the tentative attendance to be present but didn't actually show up

## For Eaters:
- View the menu for each day, either through the website or through the telegram notification
- Give tentative attendance for the day, again either through the website or simply by typing '/attend' in the telegram chat with the bot
- In case of any emergency/sudden work, the eater can evade the penalty by substituting the food by either prompting through the website or typing '/substitute' in telegram. The evasion however, is a subject to the special attendees
- Special attendees are those who didn't prompt their tentative attendance, but showed up, in this case, they can eat the substituted food (if available)

Annapurna is primarily made (but is not limited to) be used in public messes. The messes would have to follow a Time Table, an example use of Annapurna for a mess with 3pm as the food serving batch is:
> 7:00 AM -- The caterer sets the menu
> 7:00 AM - 11:00 AM -- The eaters could post their tentative attendance
> 11:00 AM - 12:00 PM -- The caterer recieves the ingredient list based on the attendance and confirms the same in the inventory
> 12:00 PM -- The food preparation starts
