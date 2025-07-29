(function($){
	// Definiamo il plugin jQuery come funzione estendibile
	$.fn.checkHidden = function(options){
		// Impostazioni di default + eventuali override dell'utente
		const settings = $.extend({
			classFilter: '.checkHidden',	// Classe da usare per filtrare i checkbox target
			hiddenSuffix: '_hidden',		// Suffisso per il campo hidden che sarà aggiornato al change
			oldSuffix: '_hidden_old'		// Suffisso per il campo hidden che rappresenta lo stato iniziale
		}, options);

		// Funzione per inizializzare il checkbox e aggiungere gli input hidden associati
		function inizializza($checkbox) {
			const name = $checkbox.attr('name');					  // Recupera il name del checkbox
			const valore = $checkbox.is(':checked') ? 'on' : 'off';	  // Determina il valore attuale

			// Crea il campo hidden "old" se non esiste ancora
			if ($(`input[name="${name}${settings.oldSuffix}"]`).length == 0)
				$checkbox.after(`<input type="hidden" name="${name}${settings.oldSuffix}" value="${valore}">`);

			// Crea il campo hidden principale se non esiste
			if ($(`input[name="${name}${settings.hiddenSuffix}"]`).length == 0)
				$checkbox.after(`<input type="hidden" name="${name}${settings.hiddenSuffix}" value="${valore}">`);
		}

		// Inizializza tutti i checkbox già presenti nel DOM al ready
		$(document).ready(function () {
			$(`${settings.classFilter}.form-check-input[name]`).each(function () {
				inizializza($(this));
			});
		});

		// Assegna listener globale per aggiornare i campi hidden al cambio di stato
		$(document).on('change', `${settings.classFilter}.form-check-input[name]`, function () {
			const name = $(this).attr('name');
			const valore = $(this).is(':checked') ? 'on' : 'off';
			$(`input[name="${name}${settings.hiddenSuffix}"]`).val(valore);
		});

		// Osserva il DOM per gestire checkbox aggiunti dinamicamente
		const observer = new MutationObserver(function(mutations){
			mutations.forEach(function(mutation){
				// Per ogni nodo aggiunto...
				$(mutation.addedNodes).each(function(){
					const $node = $(this);

					// Se il nodo è un checkbox target, lo inizializziamo
					if ($node.is(`${settings.classFilter}.form-check-input[name]`)) {
						inizializza($node);
					}

					// Se contiene checkbox figli target, li inizializziamo
					$node.find(`${settings.classFilter}.form-check-input[name]`).each(function(){
						const $cb = $(this);
						inizializza($cb);
					});
				});
			});
		});

		// Avvia l’osservazione del DOM per gestire modifiche
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		// Restituisce il context originale per chaining jQuery
		return this;
	};
})(jQuery);
