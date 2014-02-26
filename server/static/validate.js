    function keypresshandler(evt) {
        evt = evt || window.event;

        // exclude special keys in Gecko (Delete, Backspace, Arrow keys,... )
        if (evt.which !== 0)
        {
            var charCode = evt.which === undefined ? evt.keyCode : evt.which;
            var charTyped = String.fromCharCode(charCode);

            if (/[\w\s\x08-]/.test(charTyped) === false)
            {
                document.getElementById("msg").innerHTML = "The title can only contain alphanumeric characters as well as spaces, \
                                                            hyphens, and underscores.";
                // document.getElementById("msg").innerHTML = 'The character "' + charTyped + '" is not allowed in the title.';
                document.getElementById("msg").className = "flash";
                // document.getElementById("warning").innerHTML = '"' + charTyped + '" is not allowed.';
                return false;
            }
            document.getElementById("warning").innerHTML = "";
        }
    }
