# Firebase

## Getting Started

```bash
# 1. Create firebase project in console
# https://console.firebase.google.com/?pli=1

# 2. Install Firebase CLI and login
npm install -g firebase-tools
firebase login

# 3. Set your project ID in .firebaserc
sed -ibak s/saas-starter-kit/super-cool-product/ .firebaserc

# 4. Create a SQL Database
# https://console.cloud.google.com/sql/instances
# Add 0.0.0.0/0 to authorization until https://issuetracker.google.com/issues/36388165 is fixed

# 5. Configure your database URL
firebase functions:config:set 'mysql.url=mysql://root:<password>@<ip>/the_product'

# 6. Deploy to prod!
yarn deploy
```


## Resources

* [Sample server](https://github.com/firebase/functions-samples/tree/master/quickstarts/time-server)
