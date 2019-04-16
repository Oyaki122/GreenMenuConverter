module.exports = function dairyFileName (date) {
  const today = new Date()
  const day = new Date(parseInt(today.getFullYear()) + '/' + date)
  const howWeek = Math.floor((day.getDate() - day.getDay() + 12) / 7)
  const fileName =
    day.getFullYear() + '_' + (day.getMonth() + 1) + '_' + howWeek + '.csv'
  return fileName
}
