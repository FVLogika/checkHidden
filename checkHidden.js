(function($){
	// 📦 Definiamo il plugin jQuery come funzione estendibile
	$.fn.checkHidden = function(options){
		// ⚙️ Impostazioni di default + eventuali override dell'utente
		const settings = $.extend({
			classFilter: '.checkHidden',	// CSS selector per identificare i checkbox target
			hiddenSuffix: '_hidden',		// Campo hidden che traccia lo stato corrente
			oldSuffix: '_hidden_old'		// Campo hidden che traccia lo stato iniziale
		}, options);

		// 🛠️ Inizializza il checkbox e aggiunge gli input hidden associati, se non già presenti
		function inizializza($checkbox) {
			const name = $checkbox.attr('name');					  // Recupera il name del checkbox
			const valore = $checkbox.is(':checked') ? 'on' : 'off';	  // Valore booleano normalizzato come stringa

			// 🧾 Crea campo hidden "old" solo se non esiste: serve come snapshot iniziale
			if ($(`input[name="${name}${settings.oldSuffix}"]`).length == 0)
				$checkbox.after(`<input type="hidden" name="${name}${settings.oldSuffix}" value="${valore}">`);

			// 🧾 Crea campo hidden principale: aggiornato dinamicamente al change
			if ($(`input[name="${name}${settings.hiddenSuffix}"]`).length == 0)
				$checkbox.after(`<input type="hidden" name="${name}${settings.hiddenSuffix}" value="${valore}">`);
		}

		// 🚀 All'avvio, inizializza tutti i checkbox già nel DOM
		$(document).ready(function () {
			$(`${settings.classFilter}.form-check-input[name]`).each(function () {
				inizializza($(this));
			});
		});

		// 🔁 Listener globale: aggiorna campo hidden principale ogni volta che cambia lo stato del checkbox
		$(document).on('change', `${settings.classFilter}.form-check-input[name]`, function () {
			const name = $(this).attr('name');
			const valore = $(this).is(':checked') ? 'on' : 'off';
			$(`input[name="${name}${settings.hiddenSuffix}"]`).val(valore);
		});

		// 🧮 Imposta *stato iniziale* (e lo rende coerente col campo old + hidden)
		$(document).on('set-old', `${settings.classFilter}.form-check-input[name]`, function (e, val) {
			const stato = val == 1 || val === true ? 'on' : 'off';	// Consente anche 1/0 come booleani JS
			const name = $(this).attr('name');

			$(this).prop('checked', stato === 'on');	// Imposta visualmente
			$(`input[name="${name}${settings.hiddenSuffix}"]`).val(stato); // Campo attuale
			$(`input[name="${name}${settings.oldSuffix}"]`).val(stato);	   // Campo iniziale
		});

		// 🔄 Imposta *stato nuovo*, senza modificare il campo old
		$(document).on('set-val', `${settings.classFilter}.form-check-input[name]`, function (e, val) {
			const stato = val == 1 || val === true ? 'on' : 'off';
			const name = $(this).attr('name');

			$(this).prop('checked', stato === 'on');
			$(`input[name="${name}${settings.hiddenSuffix}"]`).val(stato);
		});

		// 🧿 Osserva il DOM e inizializza i checkbox aggiunti dinamicamente
		const observer = new MutationObserver(function(mutations){
			mutations.forEach(function(mutation){
				// ✅ Per ogni nodo aggiunto...
				$(mutation.addedNodes).each(function(){
					const $node = $(this);

					// 🎯 Se il nodo è un checkbox target diretto
					if ($node.is(`${settings.classFilter}.form-check-input[name]`)) {
						inizializza($node);
					}

					// 📂 Se il nodo contiene checkbox target annidati
					$node.find(`${settings.classFilter}.form-check-input[name]`).each(function(){
						const $cb = $(this);
						inizializza($cb);
					});
				});
			});
		});

		// 🎬 Avvia l’osservazione su tutto il body (childList + subtree)
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		// 🔗 Restituisce il context originale per chaining jQuery
		return this;
	};
})(jQuery);
