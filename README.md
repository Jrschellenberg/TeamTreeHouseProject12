# TeamTreeHouseProject12 Capstone Project
This is an application to allow a user to select locations using google maps. The user selects a location to start from, a location to end at, and multiple locations in between. The application will then calculate the shortest possible trip with the given input. Once the route has been calculated. It will then render the route, broken into instructions. If you wish, you may save your phone number to the account, and then text the instructions to your phone, along with google map routes for each linked destination.

In order to begin using this application, Please login and authenticate using Googles OAuth V2. This is to ensure that no malicious api calls may be requested against my server, as I have rate limiting. Users may make up to 100 API requests every 15 minutes. However, May only make 5 requests using third party services, every 5 minutes.

IMPORTANT NOTES:
This project used to rely on a third party algorithm. However, upon developing, it appears this algorithm had broke some caveats.The algorithm started bugging out and it would not calculate the route at times.

I ended up implementing my own algorithm within node for solving the TSP. With a lot and help from this repo https://github.com/trekhleb/javascript-algorithms

This algorithm Can only handle up to roughly 11 stops for a given route, it appears to start bugging out after you go over around 11. I had ended up investing more time into this project than initially anticipated. Because of this I am having to leave the bugs for now as is. If someone likes this project and wishes to have it improved. Please contact me and I will let you know if at that time I have the time to invest.



# Getting Started

Follow these instructions if you wish to get a copy of the website up and running on your development machine for testing and debugging purposes.

## Prerequisites
- This project requires mongoDb installed and configured on the server. For more information please visit one of the following:
  -  For [Windows](http://treehouse.github.io/installation-guides/windows/mongo-windows.html)
  -  For [Mac](http://treehouse.github.io/installation-guides/mac/mongo-mac.html)
- Project Utilizes third-party API's And will require a .env file to be created @ /.env Please rename example_.env --> .env

  - Requires an API key for google Maps Please see [Here](https://developers.google.com/maps/documentation/distance-matrix/start#get-a-key)
  - Requires an API key for Twilio Please see [Here](https://www.twilio.com/)

## Installing
Navigate to the local directory where the repo was installed

Run ``npm install``

Fill out Credentials required in ``./example_.env``
Rename ./example_.env --> .env 

Run ``npm start``

### Deployment
- Deployed with:
  - [Docker](https://www.docker.com/)
See [Deploy.md](https://github.com/Jrschellenberg/TeamTreeHouseProject12/blob/master/documentation/deploy.md)

### Built With
- [Express](https://expressjs.com/)
- [Babel](https://babeljs.io/)
- [Parcel](https://parceljs.org/)
- [Mongoose](http://mongoosejs.com/docs/guide.html)
- [Vue](https://vuejs.org/v2/guide/)
- [Bootstrap 4.1](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
- Tested with:
  - [Mocha](https://mochajs.org/)
  - [Chai](http://www.chaijs.com/)
  
### Contributing
  
### Versioning
  
### Authors
- Justin Schellenberg
  
### License
- Apache-2.0 See [Here](https://github.com/Jrschellenberg/TeamTreeHouseProject12/blob/master/LICENSE)

### Acknowledgements
- Thank You to anyone who's code was used
- Inspiration
- README.md inspiration from [Zencash](https://github.com/ZencashOfficial/website)
  


