# Responsive JSON carousel
A responsive carousel that is being feed by a JSON file or a JSON object

**Run locally**
1. download the zip
2. in terminal: cd location/of/download
3. npm install
4. gulp connect
5. visit http://localhost:8080/ in the browser

**Preview**
http://jsoncarousel.pixelbash.nl/


**1. Setup the JSON file or JSON object**

```JSON
[{
  "title" : "The title of the slide",
  "link"  : "The url of the slide",
  "description": "De eigenaresse en enkele gasten zijn totaal overrompeld door de gewapende man.",
  "enclosure": {
		"_url": "The url of the image",
  }
}]
```

**2. Give an < div > an unique ID**
```HTML
<div id="uniqueID"></div>
```

**3. Call the function on the unique ID**

```javascript
$(document).ready(function() {
    $('#uniqueID').jCarousel({
      jsonUrl: 'json/opsporingverzocht-zaken.json',
      itemMargin: 5,
      autoPlay: true,
      intervalSpeed: 2000,
      animationSpeed: 500,
    });
});
```
**Multiple sliders can be set with unique id's**
