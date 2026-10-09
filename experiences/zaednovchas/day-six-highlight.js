(() => {
    const participantPairs = [
        'Виктория Георгиева – Ирена Димитрова',
        'Вера Нечева – Ирена Димитрова',
        'Велислава Торчанова – Евдокия Чолакова',
        'Емили Маркова – Борислав Михайлов',
        'Ирина Петрова – Евдокия Чолакова',
        'Каролина Зорова – Гергана Запорожанова',
        'Мартин Бялов – Таня Ройдева',
        'Силвия Христова – Мариета Гигова'
    ];

    function removeText(textNode, values) {
        if (!textNode.nodeValue) {
            return;
        }

        const originalText = textNode.nodeValue;
        const cleanedText = values.reduce(
            (text, pair) => text.split(pair).join(''),
            originalText
        );

        if (cleanedText === originalText) {
            return;
        }

        textNode.nodeValue = cleanedText;
    }

    function cleanEvent(event, values) {
        const walker = document.createTreeWalker(event, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }
        textNodes.forEach(textNode => removeText(textNode, values));
    }

    function cleanTimeline() {
        document.querySelectorAll('.timeline-event').forEach(event => {
            const eventText = event.textContent;

            if (eventText.includes('Ден 6')) {
                cleanEvent(event, participantPairs);
            }

            if (eventText.includes('Първо посещение от ментор - Модул 1 - Принадлежност и безопасност')) {
                cleanEvent(event, ['(Милена Арав)']);
            }

            if (eventText.includes('Ден 2') && eventText.includes('Видеоурок')) {
                cleanEvent(event, ['Ивелина']);
            }

            if (eventText.includes('Модул 2')) {
                const status = event.querySelector('.event-status');
                if (status) {
                    status.className = 'event-status status-завършено';
                    status.textContent = 'Завършено';
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        cleanTimeline();

        const timeline = document.getElementById('timeline-container');
        if (timeline) {
            new MutationObserver(cleanTimeline).observe(timeline, { childList: true, subtree: true });
        }
    });
})();