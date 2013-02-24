$(document).ready(function(){
    $('button.stemmer').click(function(){
        var text, words;
        text = $('.text').val();

        // we delete the Twitter mentions, to avoid including usernames in the word list
        text = deleteMentions(text);

        // we split the text into words, using the most common separators
        words = splitWords(text);

        // cuenta palabras
        countFrequency(words);
    });

    function deleteMentions (text) {
        return text.replace(/(@+)(\w+)/g, '');
    }

    function splitWords (text) {
        var regex = /[\s,.;:¡!()¿?@]+/;

        // DEBUG
        console.log(text.split(regex));
        return text.split(regex);       
    }

    function countFrequency (words) {
        var freq = {}, i, len;
        len = words.length;
        
        for (i=0; i<len; i++) {
            if (typeof freq[words[i]] === 'number') {
                freq[words[i]] += 1;
            } else  {
                freq[words[i]] = 1;
            }   

            delete freq[""];            
        }

        // DEBUG
        console.log(freq, "frequency");
        return freq;
    }

    function sortFrequency (freq) {
        freq.sort(function compFrequency (a, b) {

            // TODO
            var names = [];
            for(var name in freq) {
                names.push(name);
            }

            for (var name in names) {

            }
        });

    }
});