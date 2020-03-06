var database;
var databaseBrut = Array();
var page = "home";
var currentIdx = -1;
var currentFiltre = "";

window.addEventListener('load', function () {
    document.addEventListener('deviceready', function () {
        document.addEventListener("backbutton", function(e){
            console.debug('back');
            e.preventDefault();
            if(page != "home")
            {
                page = "home";
                loadPage();
            }
        }, true);
    }, false);
}, false);

$(document).ready(function (){
    $.get("extract.csv", function(data) {
        databaseBrut = $.csv.toObjects(data, {});
        database = Array();
        for(var i=0; i<databaseBrut.length; i++)
        {
            var temp = {};
            var temp2 = {};
            $.extend(temp,databaseBrut[i]);
            $.extend(temp2,databaseBrut[i]);
            temp.idx = i;
            temp2.idx = i;

            var eltIdxNom = temp;
            eltIdxNom.search = temp.nom.trim();
            database.push(eltIdxNom);

            var eltIdxMarque = temp2;
            eltIdxMarque.search = temp2.marque.trim();
            database.push(eltIdxMarque);
        }
        console.dir(database);
        database.sort(function(a, b) {
            if(cleanString(a.search) == cleanString(b.search)){
                return 0;
            }
            return (cleanString(a.search) < cleanString(b.search)) ? -1 : 1;
        });
       loadPage();
        console.debug('end extract2='+databaseBrut.length);
    });
    $('#recherche').keyup(function(){
        currentFiltre = $('#recherche').val().trim();
        if(currentFiltre != "")
        {
            currentFiltre = cleanString(currentFiltre);
            populateLines();
        }
    });
    $('body').live('swiperight', function() {
        console.debug('swiperight');
        if(page == 'display')
        {
            page = 'home';
            loadPage();
        }
        return false;
    });
});

function loadPage()
{
    if(page == "home")
    {
        init();
    }
    else if(page == 'display')
    {
        display(currentIdx);
    }
}

function init()
{
    populateLines();
    $('#recherche-container').show();
    $('#display-container').hide();
    $('#recherche').focus();
}

function populateLines()
{
    console.debug('populateLines '+currentFiltre);
    $('#list').empty();
    var toAdd = Array();
    if(currentFiltre)
    {
        for(var i=0; i<database.length; i++)
        {
            var valComp = cleanString(database[i].search);
            if(valComp.indexOf(currentFiltre) == 0)
            {
                var elt = {};
                $.extend(elt,database[i]);
                toAdd.push(elt);
            }
        }
    }
    else
    {
        toAdd = database;
    }
    console.dir(toAdd);
    console.dir(toAdd.length);
    if(toAdd.length)
    {
//        $('#list').append('<li id="resultats" data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-a ui-corner-top">Résultats</li>');
        for(var i=0; i<toAdd.length; i++)
        {
            if(toAdd[i].search != "")
                $("#list").append('<li id="elt-'+toAdd[i].idx+'" class="ui-li ui-li-static ui-btn-up-c" data-theme="c">'+toAdd[i].search+'</li>');
        }
        $('li').hover(
            function(obj){
                console.debug('hover in');
                $(this).addClass('hover');
            },
            function(obj) {
                console.debug('hover out');
                $(this).removeClass('hover');
            }
        );
        $('li').click(function() {
            var id = $(this).attr('id');
            console.debug('id='+id);
            if(id != "")
            {
                tabId = id.split('-');
                currentIdx = tabId[1];
                page = 'display';
                loadPage();
            }
        });
    }
    else
    {
        console.debug('no res');
        var texte = "Aucun résultat";
        if(currentFiltre)
        {
            texte+=' pour le filtre "'+currentFiltre+'"';
        }
        $('#list').append(texte);
    }
}

function display(idx)
{
    console.dir(databaseBrut);
    $('#display-type').html(databaseBrut[idx].type);
    $('#display-nom').html(databaseBrut[idx].nom);
    $('#display-marque').html('('+databaseBrut[idx].marque+') &reg;');
    $('#display-solvant_perf').html(databaseBrut[idx].solvant_perf);
    $('#display-volume_perf').html(databaseBrut[idx].volume_perf);
    $('#display-administration').html(databaseBrut[idx].administration);
    $('#display-remarques').html(databaseBrut[idx].remarques);

    $('#recherche-container').hide();
    $('#display-container').show();

}

function cleanString(s){
        var r=s.toLowerCase();
        r = r.replace(new RegExp("\\s", 'g'),"");
        r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
        r = r.replace(new RegExp("æ", 'g'),"ae");
        r = r.replace(new RegExp("ç", 'g'),"c");
        r = r.replace(new RegExp("[èéêë]", 'g'),"e");
        r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
        r = r.replace(new RegExp("ñ", 'g'),"n");
        r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
        r = r.replace(new RegExp("œ", 'g'),"oe");
        r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
        r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
        r = r.replace(new RegExp("\\W", 'g'),"");
        return r;
    };