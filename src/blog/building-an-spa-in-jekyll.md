---
title: Building an SPA in Jekyll
layout: layouts/article.vto
date: 2019-04-28
type: post
excerpt: An explanation of how I leveraged Jekyll's plugin system and the History API to build an SPA.
---
GitHub pages uses Jekyll by default and so, I started using it for my website. Around the same time however, I was also exploring React and other client side Javascript frameworks typically used to build SPAs. This naturally led me to explore if I can combine these approaches.

One feature of these frameworks that intrigued me the most and that I wanted to really replicate was client side routing which meant that the client can avoid downloading the full HTML page.

My idea was to leverage the Jekyll build process to create JSON files with only the unrepeated information. Then fetch these JSON files using an AJAX call, do client side rendering and use the History API for routing.

Here's the step-by-step breakdown of how I implemented this idea:

## Step 1

In all my Jekyll layouts, the main tag contains all the content that changes across different pages. So, I wrote a simple plugin that extracts the content in the main tag and the title tag and generates a JSON using that:

```ruby
Jekyll::Hooks.register :site, :post_write do |site|
  
  Dir.glob(File.join(site.dest, '**/*.html')) do |original_file_path|
    
    raw_file_path = original_file_path.sub(site.dest, File.join(site.dest, 'raw')).sub('.html', '.json')
    raw_file_dir = File.dirname(raw_file_path)
    FileUtils.mkdir_p(raw_file_dir) unless File.exist?(raw_file_dir)
    original_content = File.read(original_file_path)
    raw_content = original_content.split('<main>').last.split('</main>').first
    title = original_content.split('<title>').last.split('</title>').first
    page_data = {
      'title': title,
      'content': raw_content,
    }
    
    File.open(raw_file_path, 'w') do |raw_file|
      raw_file.write(page_data.to_json)
    end
  
  end

end
```

As you can see in the above code, I use [Jekyll Hooks](https://jekyllrb.com/docs/plugins/hooks/) to register an event handler for **:post_write** event on the **:site** container. This allows me to extract content site wide after all content manipulations like content minification and save them in a directory called raw.

## Step 2

This content now had to be asynchronously retrieved and had to be displayed. To do that I wrote some simple Vanilla JS that sends an AJAX request, changes the content simply by replacing the **innerHTML** in the **main tag** and changes the title by assigning a new value to **document.title**.

```js
function changeView(location) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xhttp.responseText);
      document.title = data["title"];
      document.querySelector('main').innerHTML = data["content"];
      window.scrollTo(0, 0);
    }
  };
  if (location === '/') {
    location = '/index';
  }
  location = '/raw' + location + '.json';
  console.log(location);
  xhttp.open('GET', location, true);
  xhttp.send();
}
```

## Step 3

Add an event handler to all elements with the class, **local-link** that uses the above **changeView()** function while maintaining URL state with the help of the History API.

```js
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('local-link')) {
    e.preventDefault();
    if (window.location.pathname != e.target.pathname) {
      history.pushState({}, '', e.target.pathname);
      changeView(e.target.pathname);
    }
  }
});
```

Also, I had to write an event handler for the **popstate** event to make sure that the back button works properly.

```js
window.addEventListener('popstate', function (e) {
  changeView(window.location.pathname);
});
```

## Step 4

Obviously, add the **local-link** class to all links local to the website to make sure that all the JS written actually works.