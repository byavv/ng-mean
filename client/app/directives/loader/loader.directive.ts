require("./loader.less");
export default class LoaderDirective implements ng.IDirective {
    public restrict = "E";
    public template =
        '<div class="loader-container">' +
            '<div class="loader">' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
                '<div class= "loader-block"> </div>' +
            ' </div>' +
        ' </div>';
}
