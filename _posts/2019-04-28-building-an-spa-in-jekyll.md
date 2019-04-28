---
title: Building an SPA in Jekyll
layout: article
---
I have created my personal site and blog using Jekyll while ensuring that it is an SPA and here's how I did it.

I know that there are alternatives to [Jekyll](https://jekyllrb.com/) that already generate an [SPA](https://en.wikipedia.org/wiki/Single-page_application) but the problem is that they are too opinionated on which JavaScript framework they use. For example, [Gatsby.js](https://www.gatsbyjs.org/) uses [React.js](https://reactjs.org/) and [Nuxt.js](https://nuxtjs.org/) uses [Vue.js](https://vuejs.org/) and for a simple blog I feel these frameworks are an overkill.

So I decided to stick with Jekyll, my favourite static site generator mostly because of the ability to extend it using plugins that can be written in Ruby.

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

Obviously, add the **local-link** class to all links local to the website to make sure that all the JS written actually works. 😁

## Conclusion

It is not very hard to build an SPA and does not require any fancy JS frameworks. In fact, using innerHTML is also much more efficient than using DOM directly, using Virutal DOM or any other similar alternatives and is enough for a simple blog application.

Also, not to brag but I believe that performance of websites is quite important for good user experience and I made sure that my website scores a 100 in all categories of Google Audits and how I did that can be another article.

!["Audits of pravan.me"](/assets/img/audits.png)

Here's a link to my website: <https://www.pravan.me> and here's a link to the Github repository with the source code of my website: <https://github.com/pravan/website>.

Thank you for reading this article. 😁