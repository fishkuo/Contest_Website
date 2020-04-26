var city = document.getElementById("city_menu");
var id = document.getElementById("id_menu");

city.addEventListener("change", function () {
    fetch("test.json")
        .then((response) => response.json())
        .then((json) => {
            var selected = json[this.value];
            while (id.options.length > 0) {
                id.options.remove(0);
            }

            Array.from(selected).forEach(function (element) {
                var option = new Option(element, element);
                id.appendChild(option);
            });
        });
});
