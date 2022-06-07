# YelpCamp
## Project Description 


YelpCamp is a website where users can create and review campgrounds.

## Features, as a User: 
* able to register, log in, log out and update their profile;
* able to create, edit, and remove campgrounds
* able to review campgrounds or remove their review, edit review(in process)

## Running the project

You need TWO terminal windows/tabs for this.

1. Set up Mongo database by installing [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code
3. To get mapbox maps create an account on [mapbox] (https://www.mapbox.com/)
3. Clone the repository onto your local device (following steps):
```
git clone https://github.com/ElenaCherpakova/YelpCamp.git
cd YelpCamp
npm install
```
4. Install dependencies using the `npm install` command.
5. Create .env file in the root of the project and add the following: 
```
CLOUDINARY_CLOUD_NAME = "<nameOfFile>"
CLOUDINARY_KEY="<API Key>"
CLOUDINARY_SECRET="<API Secret>"
DB_URL="<url>"
MAPBOX_TOKEN="<API Key>"

```
6. Run ```mongod``` in another terminal and ```nodemon app.js``` in the terminal with the project.  

7. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
8. Go to <http://localhost:3000/> in your browser.


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

