let Format = {
    carParkListFormat: (data) => {
        let carParkArr = [];
        for (let i = 0; i < data.length; i++) {
            let obj = {
                car_park_name: data[i].car_park_name,
                car_park_img: data[i].car_park_img,
                address: data[i].address,
                recommend: data[i].recommend,
                residue_park_lot: data[i].parking_lots - data[i].residue_park_lots,
                phone_number: data[i].phone_number,
                car_park_id: data[i].car_park_id
            };
            carParkArr.push(obj);
        };

        return carParkArr;
    },
    nearParkListFormat: (arr, longitude, latitude) => {
        let resArr = [];
        for (let i = 0; i < arr.length; i++) {
            let carParkLong = arr[i].longitude;
            let carParkLat = arr[i].latitude;

            var distance = Math.pow((carParkLong - longitude), 2) + Math.pow((carParkLat - latitude), 2);
            if (distance < 1) {
                var obj = {
                    car_park_name: arr[i].car_park_name,
                    car_park_id: arr[i].car_park_id,
                    address: arr[i].address,
                    phone_number: arr[i].phone_number,
                    residue_park_lots: arr[i].residue_park_lots,
                    recommend: arr[i].recommend,
                    parking_lots: arr[i].parking_lots,
                    car_park_img: arr[i].car_park_img,
                    charge_ruls: arr[i].charge_ruls,
                    latitude: arr[i].latitude,
                    longitude: arr[i].longitude
                }
                resArr.push(obj);
            }
        };
        return resArr;
    },
    dateFormate() {
        var date = new Date();
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    },
    receiveAmountFormat(start_datetime, end_datetime) {
        var start_stamp = Date.parse(start_datetime);
        var end_stamp = Date.parse(end_datetime);
        return Math.floor((end_stamp - start_stamp) / 1000 / 3600);
    },
    dayTimeFormat(start_datetime, end_datetime) {
        var date = Date.parse(end_datetime) - Date.parse(start_datetime);
        var day = Math.floor(date / 1000 / 3600 / 24);
        var hour = Math.floor(date / 1000 / 3600 % 24);
        var min = Math.floor(date / 1000 / 60 % 60);
        if (day < 1) {
            return time = hour + "小时" + min + "分钟";
        } else {
            return time = day + "天" + hour + "小时" + min + "分钟";
        }
    }
};

module.exports = Format;