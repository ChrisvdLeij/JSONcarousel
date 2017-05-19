# Responsive JSON carousel
A responsive carousel that is being feed by a JSON file or JSON object

**Preview**


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
