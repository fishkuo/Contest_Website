var city = document.getElementById("city_menu");
var district = document.getElementById("district_menu");

city.addEventListener("change", function () {
    fetch("elderCity.json")
        .then((response) => response.json())
        .then((json) => {
            var districtList = json[this.value];
            while (district.options.length > 0) {
                district.options.remove(0);
            }

            Array.from(districtList).forEach(function (element) {
                var option = new Option(element, element);
                district.appendChild(option);
            });
        });
});
