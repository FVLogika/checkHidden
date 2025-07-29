- PLUGIN: checkHidden.js
- AUTORE: Flavio

## DESCRIZIONE:

Plugin jQuery per la sincronizzazione automatica tra checkbox e campi hidden associati.
Utile per form HTML che devono rilevare lo stato modificato o iniziale di un checkbox,
inclusi quelli creati dinamicamente (es. via AJAX o modali).

Quando applicato a un checkbox con classe specifica (di default: .checkHidden), il plugin
aggiunge due campi hidden:

- [name]_hidden       → stato attuale del checkbox (on/off)
- [name]_hidden_old   → stato iniziale (snapshot)

I campi vengono aggiornati in modo automatico all'interazione dell'utente
oppure via JavaScript con eventi personalizzati.

## INSTALLAZIONE:

1. Includere jQuery (versione 3.x o successiva)
   Esempio:
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

2. Includere il plugin checkHidden
   Esempio:
```html
<script src="js/checkHidden.min.js"></script>
```
oppure
```html
<script src="https://cdn.jsdelivr.net/gh/FVLogika/checkHidden/checkHidden.min.js"></script>
```

3. Inizializzare i checkbox target nel documento:
```js
$(function(){
// ...
  $.fn.checkHidden();
});
```

## USO STANDARD:

Nel markup HTML, ogni checkbox da tracciare deve avere:
- Un attributo name (es. "notifica")
- La classe definita nel plugin (di default: .checkHidden)

## Esempio HTML:

```html
    <input type="checkbox" name="notifica" class="checkHidden form-check-input">
```

Il plugin genererà dinamicamente:
```html
    <input type="hidden" name="notifica_hidden" value="off">
    <input type="hidden" name="notifica_hidden_old" value="off">
```

Quando l'utente interagisce, il campo "_hidden" si aggiorna a "on"/"off".

## EVENTI CUSTOM SUPPORTATI:

Oltre agli aggiornamenti automatici via "change" con l'interazione con l'utente, il plugin supporta eventi JS per modificare manualmente lo stato:

1. set-old
   Descrizione: imposta il valore iniziale (e coerente) del checkbox
   Aggiorna i campi:
       - checkbox.checked
       - name_hidden
       - name_hidden_old

   Sintassi:
```js
$('input[name="notifica"]').trigger('set-old', [true]);
```

2. set-val
   Descrizione: imposta solo il valore attuale del checkbox, lasciando invariato l'iniziale
   Aggiorna:
       - checkbox.checked
       - name_hidden

   Sintassi:
```js
$('input[name="notifica"]').trigger('set-val', [false]);
```

## GESTIONE CHECKBOX DINAMICI:

Il plugin include un MutationObserver che rileva checkbox aggiunti in seguito
(es. via modale, AJAX, JavaScript) e li inizializza automaticamente.

Non è richiesta alcuna chiamata manuale per reinizializzare il plugin.

## CONFIGURAZIONE PERSONALIZZATA:

Il plugin può essere configurato passando un oggetto di opzioni alla chiamata:

Esempio:
```js
    $('.checkHidden').checkHidden({
        classFilter: '.checkHidden',
        hiddenSuffix: '_hidden',
        oldSuffix: '_hidden_old'
    });
```

Parametri:
- classFilter: selettore CSS per scegliere quali checkbox tracciare
- hiddenSuffix: suffisso per il campo hidden dinamico (modificato)
- oldSuffix: suffisso per lo snapshot iniziale

## COMPATIBILITÀ SERVER:

Quando il form viene inviato, il plugin fornisce due campi hidden per ogni checkbox gestito:

    - [name]_hidden       → stato attuale del checkbox (on/off)
    - [name]_hidden_old   → stato iniziale del checkbox (on/off)

Lato server, puoi ignorare completamente il valore standard del checkbox (es: $_POST['notifica'])
e basarti solo sui due campi hidden per sapere cosa è cambiato.

### LOGICA DI CONTROLLO:

Se i due valori sono identici → nessuna modifica da parte dell'utente.
Se i valori sono diversi → lo stato è stato cambiato e probabilmente serve aggiornare il record.

### ESEMPIO IN PHP:

Supponiamo di gestire una checkbox chiamata "notifica":
```php
    $current  = $_POST['notifica_hidden']     ?? '';
    $initial  = $_POST['notifica_hidden_old'] ?? '';
    
    if ($current !== $initial) {
        // Lo stato della checkbox è cambiato → aggiorno il database
        $db->update('utenti', [
            'notifica_enabled' => ($current === 'on' ? 1 : 0)
        ], [
            'id' => $userID
        ]);
    } else {
        // Nessuna azione: l'utente non ha modificato la spunta
    }
```

### NOTA:

Questa logica ti permette di ignorare completamente i checkbox non modificati,
evitando update inutili nel database e facilitando il tracciamento delle modifiche.


## LICENZA:

Il plugin è rilasciato liberamente per progetti personali e professionali.
È gradita citazione dell’autore quando possibile.
