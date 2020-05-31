# World weather
  Current weather and forecast for cities worldwide  

  This app started as coding challenge in one of my courses on Udemy.  
  I decided to pimp it up and create something usefull, and learn more in the process.  
  This is still very much WIP (work in progress), so it can contain errors or change significantly in future.  
  You are welcome to use the code as is or change it to suit your needs.  
  Drop me a message if you like it, or if you have suggestion to improve it.  
  Thanks.

## Check current weather and forecast

This is simple app written in html, JavaScript and PHP.  
Using Openweathermap API for fetching current weather conditions and seven days forecast.

### Installation

Requirements: 
+ web server 
+ PHP (7 recomended)
+ MySQL or MariaDb server

Copy files from *code* folder to your web server (eg. public_html/weather/).   
Make sure that your webserver user have write permission on that folder and files.  
Navigate your web browser to the folder (eg http://localhost/weather, http://your.domain/weather, ...).  
App will ask you to input server hostname, user name and password for database user (consult your server configuration).  
__Important! Database user must have permission to create database and tables on your server.__  
Input your openweathermap.org API key (app won't work without working api key).  
*You can get free api key on https://openweathermap.org/api*  
Click submit.  
Wait a few minutes (depending on your server) for creation of the database and populating it with data.  
Database is used to speed up city selection and to send proper data to openweathermap server.  
After successfull installation you will be redirected to index page and installation files will be deleted from server.

### Usage
Start writing name of the city you wish to see current weather conditions and forecast.  
After three or more entered characters you can select city from the dropdown list.  
Click on submit button and weather data will be retrieved.  
The database contains more than 200,000 cities worlwide (source openweathermap.org).  
If your city isn't in the list please select closest bigger city.
