/**
 * Title: File handling
 * CRUD operation on file
 * Author: Md Mohiuddin
 * Date: 23/06/2022
 */

// dependencies
const fs = require("fs");
const path = require("path");

// module scaffloding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname + "/../.data");

// write data to file
lib.create = (dir, file, data, callback) => {
  console.log(lib.basedir)
  // open the file
  fs.open(`${lib.basedir}/${dir}/${file}.json`, 'wx', (err1, fd) => {
    if (!err1 && fd) {
      // data converted to string
      const stringData = JSON.stringify(data)
      // write in the file
      fs.writeFile(fd, stringData, (err2) => {
        if (!err2) {
          fs.close(fd, (err3) => {
            if (!err3) {
              callback(false)
            } else {
              callback("Error occured during the close file.")
            }
          })
        } else {
          // callback('Error occured during the write file.')
          callback(err2)
        }
      })
    } else {
      // callback("Error occured during the open file.");
      callback(err1)
    }
  });
}

// read data to file
lib.read = (dir, file, callback) => {
  // read file form the file
  fs.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf-8', (err, data) => {
    if (!err) {
      callback(err, data)
    } else {
      callback('Error occurred while the reading file.')
    }
  })
}

// update data in the file
lib.update = (dir, file, data, callback) => {
  // open the file
  fs.open(`${lib.basedir}/${dir}/${file}.json`, 'r+', (err, fd) => {
    if (!err) {
      // converting data to string
      const stringData = JSON.stringify(data);
      // truncating the file 
      fs.ftruncate(fd, (err1) => {
        if (!err1) {
          // write in the file  
          fs.writeFile(fd, stringData, 'utf-8', (err2) => {
            if (!err2) {
              // close the file  
              fs.close(fd, (err3) => {
                if (!err3) {
                  callback(false)
                } else {
                  callback("Error occured during the closing file.")
                }
              });
            } else {
              callback('Error occurred during the writing file')
            }
          })
        } else {
          callback('Error occurred during the truncating file')
        }
      })
    } else {
      callback('Error occurred during the open file')
    }
  })
}

// delete the file
lib.delete = (dir, file, callback) => {
  // file delete
  fs.unlink(`${lib.basedir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false)
    } else {
      callback("Error occurred during the deleting file.")
    }
  })
}

module.exports = lib