// This is the frontend JS. We place it inside a document.ready event handler
// because we want to make sure our JS runs when the browser has finished 
// building the document from the HTML and CSS -- that is, when the document
// is "ready", rather than at the ear
$(document).ready(function (){
	console.log('yaaaaay!');

	function updatePage(pokemon) {
		var ul = $("#pokemons");
		ul.append(`<li> Name: ${pokemon.name}</li>`);
		ul.append(`<li> Height: ${pokemon.height} years</li>`);
		ul.append(`<li> Weight: ${pokemon.weight}</li>`);
		ul.append(`<li> imageurl: ${pokemon.Image}</li>`);
	}

		var pokemon_list = $("#pokemons");

	  function deleteHandler(e) {
        /*
        To delete something...
        - [x] we need to make the API call
        - [ ] IF it succeeds, we need to remove the item from the DOM
            - otherwise...
            - we need to show an error message
        */
        var title = e.target.value;
        $.ajax({
            url: '/api/pokemons',
            type: 'DELETE',
            data: {_id: e.target.id, title: title},
        }).done(function (data, status, req) {
            console.log(data);
            $(data._id)
            var _id = data._id;
            $(`#${_id}`).parent().remove();
        }).fail(function (req, status, err) {
            alert(`Oh uh! Something went wrong. Got status: ${status}\nwith error: ${err}`);
        })         
    }

    function buildListItem(name,height, weight,imageurl, _id) {

        _id = _id || 'temporary-list-item-id';
        pokemon_list.append(`<li id='li-${_id}'>${name} ${height}${weight}${imageurl}</li>`);
        var button = document.createElement('button');
        button.id = _id;
        button.name = `${height}`;
        button.value = `${height}`;
        button.addEventListener('click', deleteHandler);
        button.innerText = 'X';
        $(`#li-${_id}`).append(button);        
    }




	function readData() {
		$.get('/api/pokemons').done(
			function(data) {
				console.log(data);
				var ul = $("#pokemons");
				for (var person of data) {
					updatePage(person)
				} 
			}
		)
	}
	readData()

	var button = $("input[type='button']");
	button.on('click', writeData)
	
	function writeData() {
		var nameField = $("input[name='Name']");
		var heightField = $("input[name='Height']");
		var weightField = $("input[name='Weight']");
		var imageField = $("input[name='Image']");
		var data = {
			Name: nameField.val(), 
			Height: heightField.val(), 
			Weight: weightField.val(),
			Image: imageField.val(), 
		}
		$.post('/api/pokemons', data).done(
			function (data, status, req) {
			console.log('yayaaayyy! we have added Bernie!');
			updatePage(data);
			var {name, height, weight } = data;
			buildListItem(name, height, weight );
			nameField.val('');
			heightField.val('');
			weightField.val('');
			imageField.val('');			
		}
		).fail(function (req, status, err) {
			alert('oh Shit !!');
		})		
	}

})