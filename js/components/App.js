var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "078ThNCmjQ5M2wN7s7EFpItiu8OOmUS6";

App = React.createClass({
   getInitialState: function () {
       return {
           loading: false,
           searchingText: "",
           gif: {}
       }
   },

   handleSearch: function (searchingText) {
       this.setState({
           loading: true
       });
       this.getGif(searchingText)

           .then(function (response) {
               var data = JSON.parse(response).data;
               var gif = {
                   url: data.images.fixed_width_downsampled.url,
                   sourceUrl: data.url
               };
               this.setState({
                   loading: false,
                   gif: gif,
                   searchingText: searchingText
               });
           }.bind(this))

           .catch(function (error) {
               console.log("Something went wrong", error)
           })
   },

    getGif: function (searchingText) {
        return new Promise(
            function (resolve, reject) {
                const url = GIPHY_API_URL + "/v1/gifs/random?api_key=" + GIPHY_PUB_KEY + "&tag=" + searchingText;
                const xhr = new XMLHttpRequest();

                xhr.onload = function () {

                    if (xhr.status === 200) {
                        resolve(this.response);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };

                xhr.onerror = function () {
                    reject(new Error(`XMLHttpRequest ERROR: ${this.statusText}`));
                };

                xhr.open("GET", url);
                xhr.send();
            }
        )
    },

    render: function () {
       var styles = {
           margin: "0 auto",
           textAlign: "center",
           width: "90%"
       };
        return (
            <div style={styles}>
                <h1>Wyszukiwarka gifów!</h1>
                <p>Znajdź gifa na <a href={"http://giphy.com"}>giphy</a>. Naciskaj ENTER, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});