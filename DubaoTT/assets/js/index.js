function getCurrentTime() {
    const date = new Date();
    let currentTime = date.toLocaleTimeString(); // Lấy giờ hiện tại
    const currentDay = date.toLocaleDateString('vi-VN', { weekday: 'long' }); // Lấy thứ hiện tại
    const currentDate = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }); // Lấy ngày, tháng, năm hiện tại

    // Xóa chữ "PM" nếu tồn tại
    currentTime = currentTime.replace('PM', '');

    const currentTimeElement = $('#Time');
    currentTimeElement.text(currentTime).show();

    const currentDateElement = $('#Date');
    currentDateElement.text(currentDay + ', ' + currentDate).show();
}
// Chuyển chuỗi có dấu thành không dấu
function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
// Viết hoa chữ cái đầu
$.fn.capitalize = function () {
    return this.each(function () {
        const text = $(this).text();
        const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
        $(this).text(capitalizedText);
    });
};

// Tìm kiếm hình ảnh địa điểm
function searchImages(city) {
    const APIplace = 'uILXSVWL2QNWNFTIJQhISufyRB3BZ87Wkujhq3aV-3k';
    // Loại bỏ dấu tiếng Việt
    let cityQuery = removeDiacritics(city);
    const url = `https://api.unsplash.com/search/photos?query=${cityQuery}&client_id=${APIplace}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                let imageUrl = data.results[0].urls.regular;
                displayImage(imageUrl);
            } else {
                // Nếu không tìm thấy, thử lại với từ khóa dự phòng
                const fallback = 'Vietnam city';
                fetch(`https://api.unsplash.com/search/photos?query=${fallback}&client_id=${APIplace}`)
                    .then(response => response.json())
                    .then(data2 => {
                        if (data2.results.length > 0) {
                            let imageUrl = data2.results[0].urls.regular;
                            displayImage(imageUrl);
                        } else {
                            // Nếu vẫn không có, dùng hình mặc định
                            displayImage('./assets/image/global.png');
                        }
                    })
                    .catch(error => {
                        displayImage('./assets/image/global.png');
                    });
            }
        })
        .catch(error => {
            displayImage('./assets/image/global.png');
        });
}

// Hiển thị hình ảnh trong một thẻ <img> với thuộc tính src
function displayImage(imageUrl) {
    $('#Weather').css('background', `url(${imageUrl}) no-repeat center / cover`);
}

function Tempurature_Display() {
    const searchInput = $('#Search-input')
    const cityName = $('.city_name')
    const tem_icon = $('.tem_icon')
    const tem_number = $('.tem_number')
    const weather_state = $('.weather_state')

    const tem_feel = $('.tem_feel')
    const tem_max = $('.tem_max')
    const tem_min = $('.tem_min')

    const tem_sunrise = $('.tem_sunrise')
    const tem_sundown = $('.tem_sundown')
    const tem_Humidity = $('.tem_Humidity')
    const tem_Wind_speed = $('.tem_Wind_speed')

    const DEFAULT_VALUE = '--'


    searchInput.on('change', (e) => {
        const city = removeDiacritics($('#Search-input').val())
        const APIKey = '73c4b84f0bae92a2026803750e306692';
        const getTemday = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric&lang=vi`)
            // async: định nghĩa một hàm bất đồng bộ, cho phép xử lý không chặn và không đồng bộ trong hàm đó
            .then(async res => {
                // await giúp xử lý các tác vụ mà cần thời gian hoặc phụ thuộc vào kết quả của các hoạt động không đồng bộ mà không chặn luồng chính (main thread) của ứng dụng. Thay vì phải chờ đợi hoàn thành của một hoạt động không đồng bộ trước khi tiếp tục, chúng ta có thể sử dụng await để tạm dừng hàm bất đồng bộ và tiếp tục thực thi các công việc khác trong khi đợi kết quả trả về.
                const data = await res.json();
                console.log(data)

                cityName.html(data.name || DEFAULT_VALUE);
                tem_icon.attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                tem_number.html(Math.round(data.main.temp) || DEFAULT_VALUE)
                weather_state.html(data.weather[0].description || DEFAULT_VALUE)
                weather_state.capitalize()

                tem_feel.html(Math.round(data.main.feels_like) || DEFAULT_VALUE)
                tem_max.html(Math.round(data.main.temp_max) || DEFAULT_VALUE)
                tem_min.html(Math.round(data.main.temp_min) || DEFAULT_VALUE)

                tem_sunrise.html(moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE)
                tem_sundown.html(moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE)
                tem_Humidity.html(data.main.humidity || DEFAULT_VALUE)
                tem_Wind_speed.html(data.wind.speed || DEFAULT_VALUE)


                if (data.main.temp >= 40) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 21, 21)')
                } else if (data.main.temp >= 30 && data.main.temp < 40) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 104, 21)')
                } else if (20 <= data.main.temp && data.main.temp < 30) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(36, 160, 202)')
                } else {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(106, 162, 198)')
                }
            })
            ;

        searchInput.val('')
        searchImages(city)
    })
}

$(document).ready(function () {
    // Cập nhật giờ mỗi giây
    setInterval(getCurrentTime, 1000);

    // Hiển thị Thời tiết
    Tempurature_Display();

    // Hàm lấy vị trí hiện tại và hiển thị thời tiết
    function getLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const APIKey = '9beab509f46cb75455f40973b5ee0626';
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&lang=vi`)
                    .then(async res => {
                        const data = await res.json();
                        $('.city_name').html(data.name || '--');
                        $('.tem_icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                        $('.tem_number').html(Math.round(data.main.temp) || '--');
                        $('.weather_state').html(data.weather[0].description || '--').capitalize();
                        $('.tem_feel').html(Math.round(data.main.feels_like) || '--');
                        $('.tem_max').html(Math.round(data.main.temp_max) || '--');
                        $('.tem_min').html(Math.round(data.main.temp_min) || '--');
                        $('.tem_sunrise').html(moment.unix(data.sys.sunrise).format('H:mm') || '--');
                        $('.tem_sundown').html(moment.unix(data.sys.sunset).format('H:mm') || '--');
                        $('.tem_Humidity').html(data.main.humidity || '--');
                        $('.tem_Wind_speed').html(data.wind.speed || '--');
                        if (data.main.temp >= 40) {
                            $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 21, 21)')
                        } else if (data.main.temp >= 30 && data.main.temp < 40) {
                            $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 104, 21)')
                        } else if (20 <= data.main.temp && data.main.temp < 30) {
                            $('.Tem_NUMBER, .tem_number').css('color', 'rgb(36, 160, 202)')
                        } else {
                            $('.Tem_NUMBER, .tem_number').css('color', 'rgb(106, 162, 198)')
                        }
                        searchImages(data.name);
                    });
            }, function (error) {
                console.log('Không thể lấy vị trí hiện tại:', error);
            });
        }
    }

    // Khi trang vừa load, nếu input rỗng thì gọi trực tiếp API cho Hà Nội
    var val = $('#Search-input').val();
    let isDefault = true;
    if (!val || val.trim() === '') {
        const city = 'Ha Noi';
        const APIKey = '73c4b84f0bae92a2026803750e306692';
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric&lang=vi`)
            .then(async res => {
                const data = await res.json();
                $('.city_name').html(data.name || '--');
                $('.tem_icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                $('.tem_number').html(Math.round(data.main.temp) || '--');
                $('.weather_state').html(data.weather[0].description || '--').capitalize();
                $('.tem_feel').html(Math.round(data.main.feels_like) || '--');
                $('.tem_max').html(Math.round(data.main.temp_max) || '--');
                $('.tem_min').html(Math.round(data.main.temp_min) || '--');
                $('.tem_sunrise').html(moment.unix(data.sys.sunrise).format('H:mm') || '--');
                $('.tem_sundown').html(moment.unix(data.sys.sunset).format('H:mm') || '--');
                $('.tem_Humidity').html(data.main.humidity || '--');
                $('.tem_Wind_speed').html(data.wind.speed || '--');
                if (data.main.temp >= 40) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 21, 21)')
                } else if (data.main.temp >= 30 && data.main.temp < 40) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(248, 104, 21)')
                } else if (20 <= data.main.temp && data.main.temp < 30) {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(36, 160, 202)')
                } else {
                    $('.Tem_NUMBER, .tem_number').css('color', 'rgb(106, 162, 198)')
                }
                searchImages(data.name);
                isDefault = false;
            });
    }

    // Lắng nghe sự kiện xóa nội dung ô input
    $('#Search-input').on('keyup', function () {
        var val = $(this).val();
        if (!val || val.trim() === '') {
            // Nếu chưa từng tìm thành phố khác, mới mặc định lại Hà Nội
            if (isDefault) {
                $('#Search-input').val('Hà Nội');
                $('#Search-input').trigger('change');
            }
        }
    });
})
