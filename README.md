### Phant is No Longer in Operation

Unfortunately Phant, our data-streaming service, is no longer in service
and has been discontinued. The system has reached capacity and, like a less-adventurous Cassini,
has plunged conclusively into a fiery and permanent retirement. There are several 
other maker-friendly, data-streaming services and/or IoT platforms available 
as alternatives. The three we recommend are Blynk, ThingSpeak, and Cayenne. 
You can read our [blog post on the topic](https://www.sparkfun.com/news/2413)
for an overview and helpful links for each platform.

All secondary SparkFun repositories related to Phant have been [archived](https://github.com/blog/2460-archiving-repositories)
and pulled in as a subtree in the main [Phant GitHub repository](https://github.com/sparkfun/phant/tree/master/archived_PhantRepos).

---

# phant-manager-http [![Build Status](https://secure.travis-ci.org/sparkfun/phant-manager-http.png?branch=master)](http://travis-ci.org/sparkfun/phant-manager-http)

express based manager module for phant

## Using phant-manager-http with phant
This section outlines how to quickly get this package up and running with the **phant** module.

### Configure

* open: https://data.sparkfun.com/config
* under **Add Manager** select **HTTP**. This will add a new section below called **Manager - HTTP**
* modify any other settings you desire. Likely this is OK as-is to get started
* select **Download Package**. Avoid **Publish to NPM** unless you know what you are doing.
* unpack the downloaded package

### Install

* go to the package you downloaded: `cd phantconfig-custom`.
* do: `npm install`

### Run
This example assumes you configured the module to use port `8080`. If you have changed the HTTP port, replace `8080` with the port you chose.

* do: `npm start`
* open: http://localhost:8080/

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SparkFun Electronics. Licensed under the GPL v3 license.
