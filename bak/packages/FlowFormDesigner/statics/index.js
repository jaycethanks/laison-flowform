// var fs = require('fs')
// fs.readdir('./icons', 'utf8', function (err, data) {
//   console.log(data, '--line2')
// })

let icons = [
  'atomboy.png',
  'atomboydashboard.png',
  'atomproject.png',
  'atomproject_1.png',
  'attendanceimport.png',
  'container.png',
  'containerlog.png',
  'containerstore.png',
  'dataapi.png',
  'databasetype.png',
  'datacollection.png',
  'datadriver.png',
  'datapermission.png',
  'dataresource.png',
  'datasearch.png',
  'datasource.png',
  'datresourcedashboard.png',
  'doccontext.png',
  'docfolder.png',
  'docindex.png',
  'docsearch.png',
  'flow.png',
  'floweditor.png',
  'flowjob.png',
  'flowlog.png',
  'flowstore.png',
  'flowtask.png',
  'freedoc.png',
  'freedocsys.png',
  'jobdashboard.png',
  'joblog.png',
  'jobs.png',
  'jobtype.png',
  'mydoc.png',
  'myproject.png',
  'myresource.png',
  'payroll.png',
  'paytable.png',
  'personnel.png',
  'personneldashboard.png',
  'processing.png',
  'resourcelist.png',
  'resources.png',
  'scriptlog.png',
  'scriptstore.png',
  'siteinformation.png',
  'supervisionscreen.png',
  'uploaddoc.png',
]

let arr = icons.map((it) => {
  let icon_name = it.split('.')[0]
  return {
    name: icon_name,
    file: require('./icons/' + it),
  }
})

export default arr
