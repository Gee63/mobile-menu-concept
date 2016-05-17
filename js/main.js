$(document).ready(function () {

    var box = $(".box");
    var menuItemsContainer = $("#menu-items-container");
    var menuClosed = $(".closed");
    var menuOpen = $(".open");


    //run angles function to fix the drags angle to the screen size
    angles();
    saveWidth();


    var boxWidth = box.width();
    var windowWidth = $(window).width();
    var snapDistance = boxWidth / 4;



    //used for avoiding resize event when url input on mobile comes and goes
    var saveWindowWidth = true;
    var savedWindowWidth;

    function saveWidth(saveWidth){
        if (saveWindowWidth = true){
            windowWidth = $(window).width();
            savedWindowWidth = windowWidth;
            saveWindowWidth = false;
        }
    }




    //used to check if the menu is open or closed
    var isOpen = false;

    var left;

    //used to solve py
    var a;
    var b;
    var c;

    //initializes left position on the first drag
    var initializeLeft = true;

    var X;

    var startX;
    var startY;

    var endXposition;

//used to configure the distance dragged
    var setX;
    var startXposition;

    //Used when opening the menu
    var dragDiffernceOpening;
    //used when closing the menu
    var dragDiffernceClosing;


    Draggable.create(".box", {
        bounds: "",
        edgeResistance: 1,
        type: "x",
        onDragStart: function () {
            //setX to true so we can set the initial start position of the drag
            setX = true;

            if (isOpen) {
                //add opacity to close button
                menuOpen.removeClass("opacity-1");
                menuOpen.addClass("opacity-0");
            }

            if(!isOpen){
                //add opacity to close button
                menuClosed.removeClass("opacity-1");
                menuClosed.addClass("opacity-0");
            }

            //try figure out what direction drag is being made so we can stop ppl from dragging the menu background off the screen when it is open --Start
            var xChange = this.x - startX;
            var yChange = this.y - startY;
            var ratio = Math.abs(yChange / xChange);
            direction = [];

            if (isOpen && ratio < 1) {
                direction.push((xChange < 0) ? "left" : "right");
            }

            if (direction == "right") {
                // Kill the drag when someone drags the menu open after it is already open
                Draggable.get(".box").endDrag();
                menuItemsContainer.css('left', 0);
                return;
            }
            //--End


            TweenLite.to(menuItemsContainer, 0.3, {opacity:0.6});

            //watch the x position while dragging is true
            TweenLite.ticker.addEventListener("tick", updateXPosition);

        },
        onPress: function () {
            //record the starting values so we can compare them later... using this to determine if someone drags the menu open after is is already open. We stop the drag if they do!
            startX = this.x;
            startY = this.y;
        },
        onDragEnd: function () {


            endXposition = parseInt(this.x);
            startXposition = 0;

            initializeLeft = false;

            // if the end of drags position is less that half the screens width do this
            if (endXposition < snapDistance) {

                //snap box back to its original position
                box.css('left', -boxWidth - endXposition + 40);

                //add this class to animate the transition of the dragged item
                box.addClass("transition");

                //add transition class to the menu items for smooth hiding of menu items
                menuItemsContainer.addClass("transition");

                //set menu items left position so that they are hidden again
                menuItemsContainer.css('left', -windowWidth);

                //add opacity to close button
                menuClosed.removeClass("opacity-0");

                //add opacity to close button
                menuClosed.addClass("opacity-1");

                //add opacity to close button
                menuOpen.removeClass("opacity-1");

                //add opacity to close button
                menuOpen.addClass("opacity-0");

                TweenLite.to(menuItemsContainer, 0.8, {opacity:0.1});

                isOpen = false;

                //console.log('endXposition:', endXposition);
                //console.log('-boxWidth:', -boxWidth);
                //console.log('calculated left position:', -boxWidth - endXposition + 50);
                //console.log('drag Difference:', dragDiffernce);

            }

            // if the dragged box is dragged more than half the screen then do this
            else if (endXposition > snapDistance) {

                //set the dragged box to sit at the top of the screen (fill the screen)... add a couple pixels just to make sure the whole screen is covered
                box.css('left', -endXposition + 15);

                //add transition to box item
                box.addClass("transition");

                //add transition to menu items
                menuItemsContainer.addClass("transition");

                //add left positioning equal to window width minus window width so the menu items are moved into view
                menuItemsContainer.css('left', 0);

                //add opacity to close button
                menuClosed.addClass("opacity-0");

                //add opacity to close button
                menuClosed.removeClass("opacity-1");

                //add opacity to close button
                menuOpen.addClass("opacity-1");

                //add opacity to close button
                menuOpen.removeClass("opacity-0");

                TweenLite.to(menuItemsContainer, 0.8, {opacity:1});

                isOpen = true;

            }

            //stop watching position x value
            TweenLite.ticker.removeEventListener("tick", updateXPosition);

            //remove transition class after animation is complete so that animation isnt applied while x position is being tracked
            setTimeout(function () {
                menuItemsContainer.removeClass("transition");

            }, 500);
        }
    })

    //function for resizing screen and recalculating the angle for the mobile menu slide
    function angles() {
        var p1 = {
            x: 0,
            y: window.innerHeight
        };

        var p2 = {
            x: window.innerWidth,
            y: 0
        };

        // angle in radians
        var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        // angle in degrees
        var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

        var btnAngle = '45' - angleDeg;

        TweenLite.set("#container", {rotation: angleDeg, x: 0, y: 0, transformOrigin: "left top"})
        TweenLite.set(".box", {rotation: btnAngle})

        solvepy();
        pushMenuItemsLeft();
    }

    //solve for py so i can get the length of the drag line and apply widths to .box
    function solvepy() {
        a = parseInt(window.innerHeight);
        b = parseInt(window.innerWidth);
        c = Math.sqrt(a * a + b * b);

        var top = c / 2;
        left = -c ;

        $("#container").css('width', c + 'px');
        box.css('width', c  + 'px');
        box.css('height', c  + 'px');
        box.css('top', -top + 'px');

        //if (!isOpen) {

            box.css('left', left + 40 + 'px');
        //}
        //if (isOpen) {
        //
        //    box.css('left', 0 + 'px');
        //}

    }

    $(window).resize(function() {

        windowWidth = $(window).width();

        //alert('windowWidth:' + windowWidth)

        if (savedWindowWidth == windowWidth){
            //alert('savedWindowWidth == windowWidth. ' + 'savedWindowWidth: ' + savedWindowWidth + ' windowWidth:' +  windowWidth);
            return;
        }

        if(savedWindowWidth != windowWidth) {

            //alert('savedWindowWidth != windowWidth, ' + 'savedWindowWidth: ' + savedWindowWidth + ' windowWidth:' +  windowWidth);

            //alert('boxWidth:' + boxWidth + ' left:' + left);
            angles();
            menuReset();
            saveWindowWidth = true;
            saveWidth();
            //alert('boxWidth:' + boxWidth + ' left:' + left);
        }
        //
        //console.log('window width:', windowWidth);
        //console.log('saved window width:', savedWindowWidth);
    });

    //left positioning of menu items on load
    function pushMenuItemsLeft() {
        windowWidth = window.innerWidth;

//set the left position of menu items when page loads -- this is according to the width of the screen

        if (!isOpen) {
            menuItemsContainer.css('left', -windowWidth);
        }

        else if (isOpen) {
            menuItemsContainer.css('left', 0);

        }

        menuItemsContainer.css('width', windowWidth);
    }

    function menuReset(){

            //snap box back to its original position
            box.css('left', -boxWidth - endXposition + 40);

            //set menu items left position so that they are hidden again
            menuItemsContainer.css('left', -windowWidth);

            //add opacity to close button
            menuClosed.removeClass("opacity-0");

            //add opacity to close button
            menuClosed.addClass("opacity-1");

            //add opacity to close button
            menuOpen.removeClass("opacity-1");

            //add opacity to close button
            menuOpen.addClass("opacity-0");

        isOpen = false;
    }

    //track x position so menu items can be pulled left and right as menu is dragged up and down
    function updateXPosition() {

        var windowWidth = window.innerWidth;
        var draggable = Draggable.get(".box");
        X = Math.round(draggable.x);


        //this is more the slide of the menu items on menu close drag. Set start position to X then set setX to fasle to it doesnt update again
        if (setX) {
            startXposition = X;
            setX = false;
        }

        //set the dragDiffernce .... this is the distance tha has been dragged from start of drag to current position

        dragDiffernceOpening = startXposition - (X/2);
        dragDiffernceClosing = startXposition - X;

        if (!isOpen && !initializeLeft) {
            //set the menu items left position according to the x position to bring it in smoothly while dragging is taking place X = X - endXposition;
            left = 0 - windowWidth - dragDiffernceOpening;
            menuItemsContainer.css('left', left);
        }

        else if (isOpen) {
            //set the menu items left position according to the differnce that has been dragged
            left = dragDiffernceClosing;
            menuItemsContainer.css('left', -left);
        }


        else if (initializeLeft) {
            left = 0 - windowWidth + (X / 2);
            menuItemsContainer.css('left', left);
        }
    }

})



