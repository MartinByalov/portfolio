// Investment calculator engine

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const initDepositIn = document.getElementById("initDeposit");
    const monthlyDepositIn = document.getElementById("monthlyDeposit");
    const annualReturnIn = document.getElementById("annualReturn");
    const returnSlider = document.getElementById("returnSlider");
    const yearsIn = document.getElementById("years");
    const yearsSlider = document.getElementById("yearsSlider");
    const compoundFreqSelect = document.getElementById("compoundFreq");
    const inflationRateIn = document.getElementById("inflationRate");

    const resTotalEl = document.getElementById("resTotal");
    const resInterestEl = document.getElementById("resInterest");
    const resInterestPercentEl = document.getElementById("resInterestPercent");
    const resPrincipalEl = document.getElementById("resPrincipal");
    const resRealTotalEl = document.getElementById("resRealTotal");

    const growthChartSvg = document.getElementById("growthChart");
    const growthTableBody = document.querySelector("#growthTable tbody");
    const btnExportCsv = document.getElementById("btnExportCsv");

    let currentYearlyData = [];

    // Sync sliders and inputs
    annualReturnIn.addEventListener("input", () => {
        returnSlider.value = annualReturnIn.value;
        recalculate();
    });
    returnSlider.addEventListener("input", () => {
        annualReturnIn.value = returnSlider.value;
        recalculate();
    });

    yearsIn.addEventListener("input", () => {
        yearsSlider.value = yearsIn.value;
        recalculate();
    });
    yearsSlider.addEventListener("input", () => {
        yearsIn.value = yearsSlider.value;
        recalculate();
    });

    [initDepositIn, monthlyDepositIn, compoundFreqSelect, inflationRateIn].forEach(el => {
        el.addEventListener("input", recalculate);
        el.addEventListener("change", recalculate);
    });

    // Preset buttons
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const preset = btn.dataset.preset;
            if (preset === "savings") {
                annualReturnIn.value = 4;
                returnSlider.value = 4;
                yearsIn.value = 5;
                yearsSlider.value = 5;
            } else if (preset === "index") {
                annualReturnIn.value = 8;
                returnSlider.value = 8;
                yearsIn.value = 15;
                yearsSlider.value = 15;
            } else if (preset === "aggressive") {
                annualReturnIn.value = 12;
                returnSlider.value = 12;
                yearsIn.value = 20;
                yearsSlider.value = 20;
            }
            recalculate();
        });
    });

    // Formatting helper
    function fmt(num) {
        return Math.round(num).toLocaleString("bg-BG") + " лв.";
    }

    function recalculate() {
        const initial = Math.max(0, parseFloat(initDepositIn.value) || 0);
        const monthly = Math.max(0, parseFloat(monthlyDepositIn.value) || 0);
        const rate = Math.max(0, parseFloat(annualReturnIn.value) || 0) / 100;
        const years = Math.max(1, parseInt(yearsIn.value, 10) || 1);
        const freq = parseInt(compoundFreqSelect.value, 10) || 12;
        const inflation = (parseFloat(inflationRateIn.value) || 0) / 100;

        let balance = initial;
        let totalInvested = initial;
        let cumulativeInterest = 0;
        const yearlyData = [];

        for (let y = 1; y <= years; y++) {
            const startYearBalance = balance;
            const startYearInvested = totalInvested;

            // Monthly compounding progression
            for (let m = 1; m <= 12; m++) {
                balance += monthly;
                totalInvested += monthly;

                // Monthly interest
                const monthlyRate = rate / freq * (freq / 12);
                const interestEarned = balance * monthlyRate;
                balance += interestEarned;
            }

            const yearInterest = balance - startYearBalance - (totalInvested - startYearInvested);
            cumulativeInterest = balance - totalInvested;

            yearlyData.push({
                year: y,
                totalInvested: Math.round(totalInvested),
                yearInterest: Math.round(yearInterest),
                cumulativeInterest: Math.round(cumulativeInterest),
                balance: Math.round(balance)
            });
        }

        currentYearlyData = yearlyData;

        // Metrics output
        const finalBalance = balance;
        const finalInvested = totalInvested;
        const finalInterest = finalBalance - finalInvested;
        const realBalance = finalBalance / Math.pow(1 + inflation, years);

        resTotalEl.textContent = fmt(finalBalance);
        resPrincipalEl.textContent = fmt(finalInvested);
        resInterestEl.textContent = fmt(finalInterest);
        resInterestPercentEl.textContent = `${finalBalance > 0 ? ((finalInterest / finalBalance) * 100).toFixed(1) : 0}% от крайния баланс`;
        resRealTotalEl.textContent = fmt(realBalance);

        renderChart(yearlyData);
        renderTable(yearlyData);
    }

    function renderChart(data) {
        if (!data || data.length === 0) return;

        const width = 800;
        const height = 300;
        const padding = { top: 20, right: 20, bottom: 35, left: 65 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const maxVal = Math.max(...data.map(d => d.balance)) * 1.05 || 1;
        const barWidth = Math.max(6, Math.min(32, (chartW / data.length) - 6));
        const step = chartW / data.length;

        let svgHtml = `
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#f1f5f9" stroke-width="1" />
            <line x1="${padding.left}" y1="${padding.top + chartH * 0.25}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.25}" stroke="#f1f5f9" stroke-width="1" />
            <line x1="${padding.left}" y1="${padding.top + chartH * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.5}" stroke="#f1f5f9" stroke-width="1" />
            <line x1="${padding.left}" y1="${padding.top + chartH * 0.75}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.75}" stroke="#f1f5f9" stroke-width="1" />
            <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#cbd5e1" stroke-width="1.5" />

            <!-- Y-Axis labels -->
            <text x="${padding.left - 8}" y="${padding.top + 4}" font-size="10" fill="#94a3b8" text-anchor="end">${Math.round(maxVal / 1000)}k</text>
            <text x="${padding.left - 8}" y="${padding.top + chartH * 0.5 + 4}" font-size="10" fill="#94a3b8" text-anchor="end">${Math.round(maxVal * 0.5 / 1000)}k</text>
            <text x="${padding.left - 8}" y="${padding.top + chartH + 4}" font-size="10" fill="#94a3b8" text-anchor="end">0</text>
        `;

        data.forEach((d, i) => {
            const x = padding.left + (i * step) + (step - barWidth) / 2;
            const totalH = (d.balance / maxVal) * chartH;
            const principalH = (d.totalInvested / maxVal) * chartH;
            const interestH = Math.max(0, totalH - principalH);

            const yPrincipal = padding.top + chartH - principalH;
            const yInterest = padding.top + chartH - totalH;

            svgHtml += `
                <g class="chart-bar-group">
                    <!-- Principal bar -->
                    <rect x="${x}" y="${yPrincipal}" width="${barWidth}" height="${principalH}" fill="#2563eb" rx="2" opacity="0.95">
                        <title>Година ${d.year}: Внесени: ${fmt(d.totalInvested)}</title>
                    </rect>
                    <!-- Interest bar (stacked on top) -->
                    <rect x="${x}" y="${yInterest}" width="${barWidth}" height="${interestH}" fill="#10b981" rx="2" opacity="0.95">
                        <title>Година ${d.year}: Лихва: ${fmt(d.cumulativeInterest)} | Общо: ${fmt(d.balance)}</title>
                    </rect>
                    <!-- X label (every year if <= 15, else every 2 or 5) -->
                    ${(data.length <= 15 || d.year % Math.ceil(data.length / 10) === 0 || d.year === data.length) ? `
                        <text x="${x + barWidth / 2}" y="${height - 12}" font-size="10" fill="#64748b" text-anchor="middle">Г${d.year}</text>
                    ` : ''}
                </g>
            `;
        });

        growthChartSvg.innerHTML = svgHtml;
    }

    function renderTable(data) {
        growthTableBody.innerHTML = "";
        data.forEach(d => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>Г. ${d.year}</strong></td>
                <td>${fmt(d.totalInvested)}</td>
                <td style="color: #10b981;">+${fmt(d.yearInterest)}</td>
                <td style="color: #059669; font-weight: 600;">${fmt(d.cumulativeInterest)}</td>
                <td><strong>${fmt(d.balance)}</strong></td>
            `;
            growthTableBody.appendChild(tr);
        });
    }

    // Export CSV
    btnExportCsv.addEventListener("click", () => {
        if (!currentYearlyData || currentYearlyData.length === 0) return;

        let csvContent = "Година;Внесени общо (лв);Годишна лихва (лв);Натрупана лихва (лв);Краен баланс (лв)\n";
        currentYearlyData.forEach(d => {
            csvContent += `${d.year};${d.totalInvested};${d.yearInterest};${d.cumulativeInterest};${d.balance}\n`;
        });

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `инвестиционен_план_${currentYearlyData.length}_години.csv`;
        link.click();
        URL.revokeObjectURL(url);
    });

    // Initial calculation
    recalculate();
});
