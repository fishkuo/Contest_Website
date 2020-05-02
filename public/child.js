var city = document.getElementById("city_menu");
var district = document.getElementById("district_menu");
var id = document.getElementById("id_menu");

city.addEventListener("change", function () {
    fetch("childCity.json")
        .then((response) => response.json())
        .then((json) => {
            var districtList = json[this.value];
            while (district.options.length > 0) {
                district.options.remove(0);
            }

            while (id.options.length > 0) {
                id.options.remove(0);
            }
            let option = new Option("請選擇機構名稱", "請選擇");
            id.appendChild(option);

            Array.from(districtList).forEach(function (element) {
                var option = new Option(element, element);
                district.appendChild(option);
            });
        });
});

district.addEventListener("change", function () {
    fetch("childDistrict.json")
        .then((response) => response.json())
        .then((json) => {
            var selected = json[city.value][this.value];
            while (id.options.length > 0) {
                id.options.remove(0);
            }

            while (id.options.length > 0) {
                id.options.remove(0);
            }
            let option = new Option("請選擇機構名稱", "請選擇");
            id.appendChild(option);

            Array.from(selected).forEach(function (element) {
                var option = new Option(element, element);
                id.appendChild(option);
            });
        });
});
