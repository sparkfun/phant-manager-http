# phant-manager-http [![Build Status](https://secure.travis-ci.org/sparkfun/phant-manager-http.png?branch=master)](http://travis-ci.org/sparkfun/phant-manager-http)

express based manager module for phant

## Getting Started
Install the module with: `npm install phant-manager-http`

## Using phant-manager-http with phant
This section outlines how to quickly get this package up and running with the **phant** module.

### Configure

* open: https://data.sparkfun.com/config
* under **Add Manager** select **HTTP**. This will add a new section below called **Manager - HTTP**
* modify any other settings you desire. Likely this is OK as-is to get started
* select **Download Package**. Avoid **Publish to NPM** unless you know what you are doing.
* unpack the downloaded package

### Install

* go to the package you downloaded: <code>cd phantconfig-custom</code>. Renaming this directory is cool.
* do: <code>npm install</code>

### Run 

* do: <code>npm start</code>
* open: http://localhost:8080/


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SparkFun Electronics. Licensed under the GPL v3 license.
