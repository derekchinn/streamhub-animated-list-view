# Animated List View
This is a module built on top of Livefyre's Streamhub SDK (and its List View). It animates the rendering of content in this view in order to make it more visually appealing and apparent when new content flows in.

# Using the Animated List View
Include it in your Streamhub-SDK based project (this assumes you've added "streamhub-sdk" as a package to your config file, but not the list view code):
    
    <script>
    (require(["streamhub-sdk", "src/animated-list-view"], function (SDK, AnimatedListView) {
    });
    </script>
    
Create a new instance of it (this particular example uses the "slide-down" animation):

    var listView = new AnimatedListView({
        el: document.getElementById("target-div"),
        animation: "slide-down"
    });

And then like normal, define a stream and its manager for usage:

    var streamManager = SDK.StreamManager.create.livefyreStreams({
        "articleId": "your-article-id",
        "siteId": <your site id>,
        "network": "example.fyre.co",
    });

Bind the stream to the view and watch it do its magic:

    streamManager.bind(listView).start();
    
And for posterity, everything together:

    <script>
    (require(["streamhub-sdk", "src/animated-list-view"], function (SDK, AnimatedListView) {
        var listView = new AnimatedListView({
            el: document.getElementById("target-div"),
            animation: "slide-down"
        });
        var streamManager = SDK.StreamManager.create.livefyreStreams({
            "articleId": "your-article-id",
            "siteId": <your site id>,
            "network": "example.fyre.co",
        });
        streamManager.bind(listView).start();
    });
    </script>

Done.

# Animation options
The animated list view currently provides three (3) different types of animation options slide-down, fade-in, and pulse.

## Slide Down
Elements will slowly reveal themselves by growing from a pre-defined minimum height to their maximum height in a smooth animation. To use this animation, pass `slide-down` as the animation type.
    
     var listView = new AnimatedListView({
        el: document.getElementById("target-div"),
        animation: "slide-down"
    });
        
## Fade In
Elements will push down the rest of the elements and then fade into view. To use this animation, pass `fade-in` as the animation type.

    var listView = new AnimatedListView({
        el: document.getElementById("target-div"),
        animation: "fade-in"
    });

## Pulse    
Elements will have a background shadow of a specified color will be grow and retract from it - simulating a "pulse" or "flash" of light. To use this animation, pass `pulse` as the animation type. Additionally, to change the color, you can pass HTML color values to the optional value `pulseColor`.

    var listView = new AnimatedListView({
        el: document.getElementById("target-div"),
        animation: "pulse",
        pulseColor: "#F00" // Accepts RGB, Hex, and string equivalents (e.g. red, blue, etc.)
    });
    