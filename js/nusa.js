/**
 * NUSABRIDGE - Platform Ekosistem Ekspor UMKM Indonesia
 * Interactive JavaScript: Sticky Header, Visualizations, KYC Hub,
 * Elevated RFQ & Trade Negotiation Studio, Escrow Simulator & Customs Tracker
 */

document.addEventListener('DOMContentLoaded', function () {
    // --------------------------------------------------------------------------
    // 1. STICKY NAVBAR - Menjamin menu tidak pernah tenggelam/hilang saat scroll
    // --------------------------------------------------------------------------
    // 1. RESPONSIVE STICKY ISLAND NAVBAR & MOBILE MENU CONTROLLER
    // --------------------------------------------------------------------------
    const navbarIsland = document.getElementById('nusaNavbarIsland') || document.querySelector('.nusa-navbar-island') || document.querySelector('.navbar');
    const navCollapse = document.getElementById('navbarCollapse');
    const navToggler = document.querySelector('.navbar-toggler-custom');
    
    function handleNavbarScroll() {
        if (!navbarIsland) return;
        if (window.scrollY > 20) {
            navbarIsland.classList.add('scrolled', 'shadow-sm');
        } else {
            navbarIsland.classList.remove('scrolled', 'shadow-sm');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    function closeMobileMenu() {
        if (navCollapse && navCollapse.classList.contains('show')) {
            if (window.bootstrap && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
                bsCollapse.hide();
            } else if (window.jQuery) {
                $(navCollapse).collapse('hide');
            } else {
                navCollapse.classList.remove('show');
            }
            if (navToggler) {
                navToggler.classList.add('collapsed');
                navToggler.setAttribute('aria-expanded', 'false');
            }
        }
    }

    // Smooth scroll for nav items with sticky header offset compensation
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbarIsland ? navbarIsland.offsetHeight : 75;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight - 12;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Auto-close mobile navbar on link click
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992 && navCollapse && navCollapse.classList.contains('show')) {
            if (navbarIsland && !navbarIsland.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Scrollspy highlight active menu item
    const sections = document.querySelectorAll('section[id], div[id].nusa-section');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const navHeight = navbarIsland ? navbarIsland.offsetHeight : 75;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navHeight - 60;
            const sectionId = current.getAttribute('id');
            const targetNavLink = document.querySelector(`#nusaNavbarIsland .nav-link[href*="${sectionId}"]`) || document.querySelector(`.navbar .nav-link[href*="${sectionId}"]`);

            if (targetNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('#nusaNavbarIsland .nav-link').forEach(nl => nl.classList.remove('active'));
                    targetNavLink.classList.add('active');
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 2. DIAGRAM BATANG & STATISTIK AGREGAT EKSPOR UMKM DAERAH
    // --------------------------------------------------------------------------
    let exportChartInstance = null;
    const ctxExport = document.getElementById('exportBarChart');

    const regionalExportData = {
        all: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [14.8, 12.6, 9.4, 8.2, 7.5, 6.1, 4.8], // Juta USD
            volumeTon: [1420, 1180, 720, 890, 840, 560, 410]   // Ton
        },
        butter: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [5.8, 4.9, 2.7, 3.1, 2.4, 3.8, 1.2],
            volumeTon: [520, 430, 210, 310, 240, 390, 110]
        },
        spices: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.2, 3.8, 4.5, 2.6, 3.1, 1.2, 2.9],
            volumeTon: [410, 360, 320, 280, 330, 90, 230]
        },
        coffee: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.8, 3.9, 2.2, 2.5, 2.0, 1.1, 0.7],
            volumeTon: [490, 390, 190, 300, 270, 80, 70]
        }
    };

    function renderExportChart(category = 'all') {
        if (!ctxExport) return;
        const data = regionalExportData[category] || regionalExportData.all;

        if (exportChartInstance) {
            exportChartInstance.destroy();
        }

        exportChartInstance = new Chart(ctxExport, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Nilai Ekspor (Juta USD)',
                        data: data.valuesUSD,
                        backgroundColor: 'rgba(15, 118, 110, 0.88)',
                        borderColor: '#0F766E',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Volume Ekspor (Ton)',
                        data: data.volumeTon,
                        backgroundColor: 'rgba(217, 119, 6, 0.82)',
                        borderColor: '#D97706',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Inter', sans-serif", weight: '600', size: 12 },
                            usePointStyle: true,
                            padding: 18
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0B132B',
                        padding: 12,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.datasetIndex === 0) {
                                    label += '$' + context.parsed.y + ' Juta USD';
                                } else {
                                    label += context.parsed.y.toLocaleString() + ' Ton';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: '600' } }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Nilai (Juta USD)', font: { size: 11, weight: '600' } },
                        grid: { color: 'rgba(226, 232, 240, 0.6)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Volume (Ton)', font: { size: 11, weight: '600' } },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    if (ctxExport) {
        renderExportChart('all');
    }

    // Filter Buttons for Export Chart
    const chartFilterBtns = document.querySelectorAll('.chart-filter-btn');
    chartFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            chartFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderExportChart(category);
        });
    });

    // --------------------------------------------------------------------------
    // 3. VISUALISASI DATA & SIMULASI ESCROW
    // --------------------------------------------------------------------------
    let escrowDoughnutInstance = null;
    const ctxEscrow = document.getElementById('escrowMilestoneChart');

    function renderEscrowDoughnut() {
        if (!ctxEscrow) return;
        if (escrowDoughnutInstance) escrowDoughnutInstance.destroy();

        escrowDoughnutInstance = new Chart(ctxEscrow, {
            type: 'doughnut',
            data: {
                labels: [
                    'Tahap 1: Uang Muka Produksi (30%)',
                    'Tahap 2: Hasil Inspeksi Mutu QC (30%)',
                    'Tahap 3: Bea Cukai PEB & Gate-In (20%)',
                    'Tahap 4: B/L On-Board Pelayaran (20%)'
                ],
                datasets: [{
                    data: [30, 30, 20, 20],
                    backgroundColor: [
                        '#0F766E', // Emerald
                        '#14B8A6', // Teal
                        '#D97706', // Gold
                        '#2563EB'  // Blue
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 12,
                            font: { size: 11, weight: '600' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.label}: ${context.raw}% dari Kontrak`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    if (ctxEscrow) {
        renderEscrowDoughnut();
    }

    // Interactive Escrow Simulator Slider
    const escrowSlider = document.getElementById('escrowAmountRange');
    const displayAmount = document.getElementById('escrowDisplayAmount');
    const statDp = document.getElementById('escrowStatDP');
    const statQc = document.getElementById('escrowStatQC');
    const statCustoms = document.getElementById('escrowStatCustoms');
    const statBL = document.getElementById('escrowStatBL');
    const statFee = document.getElementById('escrowStatFee');

    function updateEscrowCalculations(val) {
        const amount = parseInt(val, 10);
        if (displayAmount) displayAmount.textContent = '$' + amount.toLocaleString() + ' USD';
        
        const dp = amount * 0.30;
        const qc = amount * 0.30;
        const customs = amount * 0.20;
        const bl = amount * 0.20;
        const fee = amount * 0.005; // 0.5% fee

        if (statDp) statDp.textContent = '$' + dp.toLocaleString();
        if (statQc) statQc.textContent = '$' + qc.toLocaleString();
        if (statCustoms) statCustoms.textContent = '$' + customs.toLocaleString();
        if (statBL) statBL.textContent = '$' + bl.toLocaleString();
        if (statFee) statFee.textContent = '$' + fee.toLocaleString() + ' (0.5%)';
    }

    if (escrowSlider) {
        escrowSlider.addEventListener('input', function () {
            updateEscrowCalculations(this.value);
        });
        updateEscrowCalculations(escrowSlider.value || 50000);
    }

    // --------------------------------------------------------------------------
    // 4. KYC HUB & VERIFIKASI LEGALITAS (NIB/NPWP)
    // --------------------------------------------------------------------------
    const btnSampleUmkm1 = document.getElementById('btnSampleUmkm1');
    const btnSampleUmkm2 = document.getElementById('btnSampleUmkm2');
    const inputNib = document.getElementById('inputNib');
    const inputNpwp = document.getElementById('inputNpwp');
    const btnVerifyKyc = document.getElementById('btnVerifyKyc');
    const kycResultPlaceholder = document.getElementById('kycResultPlaceholder');
    const kycLoading = document.getElementById('kycLoading');
    const kycResultBox = document.getElementById('kycResultBox');

    if (btnSampleUmkm1) {
        btnSampleUmkm1.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220108740123';
            if (inputNpwp) inputNpwp.value = '81.423.518.2-429.000';
            triggerKycVerification('PT Nusa Java Organik (Artisan Cocoa & Shea Butter)', '0220108740123', '81.423.518.2-429.000', 'Bandung, Jawa Barat', 'KBLI 10732 (Pengolahan Kakao & Mentega Nabati)');
        });
    }

    if (btnSampleUmkm2) {
        btnSampleUmkm2.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220109923841';
            if (inputNpwp) inputNpwp.value = '92.114.823.1-901.000';
            triggerKycVerification('CV Bali Spice & Gourmet Organics', '0220109923841', '92.114.823.1-901.000', 'Gianyar, Bali', 'KBLI 10772 (Industri Rempah & Bumbu Ekspor)');
        });
    }

    if (btnVerifyKyc) {
        btnVerifyKyc.addEventListener('click', function () {
            const nibVal = inputNib ? inputNib.value.trim() : '';
            const npwpVal = inputNpwp ? inputNpwp.value.trim() : '';
            if (!nibVal || !npwpVal) {
                alert('Silakan masukkan nomor NIB dan NPWP atau klik tombol sampel.');
                return;
            }
            triggerKycVerification('PT Nusantara Butter & Agrikultur Terpadu', nibVal, npwpVal, 'Surabaya, Jawa Timur', 'KBLI 10732 (Industri Olahan Lemak & Mentega Nabati)');
        });
    }

    function triggerKycVerification(companyName, nib, npwp, address, kbli) {
        if (kycResultPlaceholder) kycResultPlaceholder.style.display = 'none';
        if (kycResultBox) kycResultBox.style.display = 'none';
        if (kycLoading) kycLoading.style.display = 'block';

        setTimeout(() => {
            if (kycLoading) kycLoading.style.display = 'none';
            if (kycResultBox) {
                kycResultBox.style.display = 'block';
                document.getElementById('resCompanyName').textContent = companyName;
                document.getElementById('resNib').textContent = nib;
                document.getElementById('resNpwp').textContent = npwp;
                document.getElementById('resAddress').textContent = address;
                document.getElementById('resKbli').textContent = kbli;
            }
        }, 700);
    }

    // --------------------------------------------------------------------------
    // 5. ELEVATED RFQ STUDIO & EXPORT CONTRACT GENERATOR
    // --------------------------------------------------------------------------
    const scenarioBtns = document.querySelectorAll('.scenario-pill-btn');
    const docTypeSelect = document.getElementById('docTypeSelect');
    const docExporterInput = document.getElementById('docExporterInput');
    const docBuyerInput = document.getElementById('docBuyerInput');
    const docCommoditySelect = document.getElementById('docCommoditySelect');
    const docVolumeInput = document.getElementById('docVolumeInput');
    const docPriceInput = document.getElementById('docPriceInput');
    const docIncotermSelect = document.getElementById('docIncotermSelect');
    const docPortLoading = document.getElementById('docPortLoading');
    const docPortDischarge = document.getElementById('docPortDischarge');
    const btnSimulateSendQuote = document.getElementById('btnSimulateSendQuote');
    const btnPrintDoc = document.getElementById('btnPrintDoc');

    // Cost Breakdown Elements
    const costRawMaterial = document.getElementById('costRawMaterial');
    const costPackaging = document.getElementById('costPackaging');
    const costLogistics = document.getElementById('costLogistics');
    const costCustoms = document.getElementById('costCustoms');
    const costMargin = document.getElementById('costMargin');
    const incotermFreightDesc = document.getElementById('incotermFreightDesc');
    const incotermInsuranceDesc = document.getElementById('incotermInsuranceDesc');
    const incotermRiskDesc = document.getElementById('incotermRiskDesc');

    // Scenarios data
    const rfqScenarios = {
        sc1: {
            exporter: 'PT Nusa Java Organik, Bandung',
            buyer: 'Bavaria Gourmet Import GmbH, Hamburg, Germany',
            commodity: 'Artisan Pure Java Cocoa Butter & Shea Butter (200g Glass Jar & Bulk)',
            volume: 5000,
            price: 12.50,
            incoterm: 'FOB Tanjung Priok, Jakarta (Incoterms 2020)',
            pol: 'Port of Tanjung Priok, Jakarta (IDTPP)',
            pod: 'Port of Hamburg, Germany (DEHAM)',
            specs: 'Fat Content 52-54%, FFA < 1.75%, Melting Point 34-36°C, Moisture < 0.2%'
        },
        sc2: {
            exporter: 'CV Kalimantan Organics Nusantara, Pontianak',
            buyer: 'Tokyo Organic Care Corp, Yokohama, Japan',
            commodity: 'Natural Unrefined Shea Butter & Raw Illipe Butter Bulk',
            volume: 6000,
            price: 14.00,
            incoterm: 'CIF Yokohama Port, Japan (Incoterms 2020)',
            pol: 'Port of Tanjung Priok, Jakarta (IDTPP)',
            pod: 'Port of Yokohama, Japan (JPYOK)',
            specs: '100% Cold Pressed, Saponification Value 180-195, Peroxide < 2.0 meq/kg'
        },
        sc3: {
            exporter: 'CV Bali Gourmet Spice & Vanilla, Gianyar',
            buyer: 'Amsterdam Spice & Flavour Traders B.V., Netherlands',
            commodity: 'Organic Gourmet Bourbon Vanilla Beans & Clove Spice',
            volume: 1500,
            price: 30.00,
            incoterm: 'CFR Rotterdam Port, Netherlands (Incoterms 2020)',
            pol: 'Port of Tanjung Perak, Surabaya (IDTPS)',
            pod: 'Port of Rotterdam, Netherlands (NLRTM)',
            specs: 'Vanillin Content > 2.2%, Length 18-20cm, Moisture 30-33%, Gourmet Grade 1'
        }
    };

    function loadRfqScenario(scKey) {
        const sc = rfqScenarios[scKey];
        if (!sc) return;

        if (docExporterInput) docExporterInput.value = sc.exporter;
        if (docBuyerInput) docBuyerInput.value = sc.buyer;
        if (docCommoditySelect) docCommoditySelect.value = sc.commodity;
        if (docVolumeInput) docVolumeInput.value = sc.volume;
        if (docPriceInput) docPriceInput.value = sc.price;
        if (docIncotermSelect) docIncotermSelect.value = sc.incoterm;
        if (docPortLoading) docPortLoading.value = sc.pol;
        if (docPortDischarge) docPortDischarge.value = sc.pod;

        updateRfqCalculationsAndDocument(sc.specs);
    }

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const scKey = this.getAttribute('data-scenario');
            loadRfqScenario(scKey);
        });
    });

    function updateRfqCalculationsAndDocument(customSpecs = null) {
        const docType = docTypeSelect ? docTypeSelect.value : 'Proforma Invoice';
        const exporter = docExporterInput ? docExporterInput.value : 'PT Nusa Java Organik';
        const buyer = docBuyerInput ? docBuyerInput.value : 'Bavaria Gourmet Import GmbH';
        const commodity = docCommoditySelect ? docCommoditySelect.value : 'Artisan Pure Java Cocoa Butter & Shea Butter';
        const volume = parseFloat(docVolumeInput ? docVolumeInput.value : 5000) || 5000;
        const price = parseFloat(docPriceInput ? docPriceInput.value : 12.50) || 12.50;
        const incoterm = docIncotermSelect ? docIncotermSelect.value : 'FOB Tanjung Priok, Jakarta';
        const pol = docPortLoading ? docPortLoading.value : 'Port of Tanjung Priok (IDTPP)';
        const pod = docPortDischarge ? docPortDischarge.value : 'Port of Hamburg (DEHAM)';

        const totalValue = volume * price;

        // Dynamic Cost Breakdown Simulation (Per unit & Total)
        const unitRaw = price * 0.58;       // 58% Bahan baku petani UMKM
        const unitPack = price * 0.12;      // 12% Kemasan ekspor food grade
        const unitLogistics = price * 0.08; // 8% Trucking & THC Pelabuhan
        const unitCustoms = price * 0.04;   // 4% PEB & Uji Karantina/Fumigasi
        const unitProfit = price * 0.18;    // 18% Keuntungan bersih UMKM

        if (costRawMaterial) costRawMaterial.textContent = '$' + (unitRaw * volume).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ($' + unitRaw.toFixed(2) + '/u)';
        if (costPackaging) costPackaging.textContent = '$' + (unitPackagingText(unitPack, volume));
        if (costLogistics) costLogistics.textContent = '$' + (unitLogistics * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (costCustoms) costCustoms.textContent = '$' + (unitCustoms * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (costMargin) costMargin.textContent = '$' + (unitProfit * volume).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' (18% Margin Bersih)';

        // Incoterms 2020 Matrix description update
        if (incoterm.includes('FOB')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> (Setelah kontainer di atas kapal)';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> (Opsional asuransi maritim)';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Beralih ke Buyer</span> saat kontainer melewati rail kapal di Pelabuhan Muat';
        } else if (incoterm.includes('CIF')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> sampai pelabuhan tujuan';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> Asuransi Marine Cargo Clause C/A';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Risiko beralih ke Buyer</span> saat kapal berlayar';
        } else if (incoterm.includes('CFR')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> sampai pelabuhan tujuan';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> secara mandiri';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Risiko beralih ke Buyer</span> saat barang on-board kapal';
        } else {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER 100%</span> dari pintu pabrik UMKM';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span>';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-warning fw-bold">Risiko beralih</span> langsung di gudang UMKM';
        }

        // Populate official preview sheet
        const previewTitle = document.getElementById('docPreviewTitle');
        const previewNumber = document.getElementById('docPreviewNumber');
        const previewDate = document.getElementById('docPreviewDate');
        const previewExporter = document.getElementById('docPreviewExporter');
        const previewBuyer = document.getElementById('docPreviewBuyer');
        const previewIncoterm = document.getElementById('docPreviewIncoterm');
        const previewPOL = document.getElementById('docPreviewPOL');
        const previewPOD = document.getElementById('docPreviewPOD');
        const previewCommodity = document.getElementById('docPreviewCommodity');
        const previewSpecs = document.getElementById('docPreviewSpecs');
        const previewQty = document.getElementById('docPreviewQty');
        const previewPrice = document.getElementById('docPreviewPrice');
        const previewTotal = document.getElementById('docPreviewTotal');
        const previewGrandTotal = document.getElementById('docPreviewGrandTotal');

        if (previewTitle) previewTitle.textContent = docType.toUpperCase();
        if (previewNumber) {
            const prefix = docType.includes('RFQ') ? 'RFQ' : (docType.includes('Invoice') ? 'PI' : 'SC');
            previewNumber.textContent = `${prefix}-NB-2026-${Math.floor(2000 + (volume % 7000))}`;
        }
        if (previewDate) {
            const now = new Date();
            previewDate.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (previewExporter) previewExporter.textContent = exporter;
        if (previewBuyer) previewBuyer.textContent = buyer;
        if (previewIncoterm) previewIncoterm.textContent = incoterm;
        if (previewPOL) previewPOL.textContent = pol;
        if (previewPOD) previewPOD.textContent = pod;
        if (previewCommodity) previewCommodity.textContent = commodity;
        if (previewSpecs && customSpecs) previewSpecs.textContent = customSpecs;
        if (previewQty) previewQty.textContent = volume.toLocaleString() + ' Units / Kg';
        if (previewPrice) previewPrice.textContent = '$' + price.toFixed(2) + ' USD';
        if (previewTotal) previewTotal.textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (previewGrandTotal) previewGrandTotal.textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' USD';
    }

    function unitPackagingText(unitPack, volume) {
        return (unitPack * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    // Attach real-time input change listeners
    [docTypeSelect, docExporterInput, docBuyerInput, docCommoditySelect, docVolumeInput, docPriceInput, docIncotermSelect, docPortLoading, docPortDischarge].forEach(elem => {
        if (elem) {
            elem.addEventListener('input', () => updateRfqCalculationsAndDocument());
            elem.addEventListener('change', () => updateRfqCalculationsAndDocument());
        }
    });

    if (btnSimulateSendQuote) {
        btnSimulateSendQuote.addEventListener('click', function () {
            const buyer = docBuyerInput ? docBuyerInput.value : 'Buyer Luar Negeri';
            const total = document.getElementById('docPreviewGrandTotal') ? document.getElementById('docPreviewGrandTotal').textContent : '$62,500.00 USD';
            
            // Show interactive simulation success toast
            const alertBox = document.getElementById('rfqSimulationAlert');
            if (alertBox) {
                alertBox.innerHTML = `
                    <div class="alert alert-success border-success shadow-sm rounded-4 p-3 d-flex align-items-center mb-0 animate__animated animate__fadeIn">
                        <i class="fas fa-check-circle fs-3 text-success me-3"></i>
                        <div>
                            <strong class="d-block text-dark">Simulasi Berhasil! Penawaran Resmi Telah Dikirim ke ${buyer}</strong>
                            <span class="small text-secondary">Nilai Kontrak: <strong>${total}</strong> • Buyer merespons positif: <em>"Penawaran disetujui. Siap menyetor 100% dana ke NusaBridge Escrow Vault."</em></span>
                        </div>
                    </div>
                `;
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    if (btnPrintDoc) {
        btnPrintDoc.addEventListener('click', function () {
            window.print();
        });
    }

    // Initialize default scenario 1
    updateRfqCalculationsAndDocument();

    // --------------------------------------------------------------------------
    // 6. DASHBOARD LOGISTIK & KEPABEANAN (Tracking B/L, PEB/PIB)
    // --------------------------------------------------------------------------
    const btnTrackShipment = document.getElementById('btnTrackShipment');
    const inputTrackingNumber = document.getElementById('inputTrackingNumber');
    const btnSampleBL = document.getElementById('btnSampleBL');
    const btnSamplePEB = document.getElementById('btnSamplePEB');
    const trackingResultBox = document.getElementById('trackingResultBox');

    if (btnSampleBL) {
        btnSampleBL.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'BL-IDN-2026-8890';
            executeTracking('BL-IDN-2026-8890', 'Bill of Lading (B/L)', 'PT Nusa Java Cocoa Butter', 'MV Nusantara Pride Voy 104N', 'Tanjung Priok -> Port of Hamburg', 'Dalam Pelayaran Samudera (In-Transit)');
        });
    }

    if (btnSamplePEB) {
        btnSamplePEB.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'PEB-040300-2026-004123';
            executeTracking('PEB-040300-2026-004123', 'Pemberitahuan Ekspor Barang (PEB)', 'CV Bali Spice Organics', 'KPU Bea dan Cukai Tanjung Perak', 'Surabaya -> Yokohama Port', 'Jalur Hijau (SPE Diterbitkan)');
        });
    }

    if (btnTrackShipment) {
        btnTrackShipment.addEventListener('click', function () {
            const trackVal = inputTrackingNumber ? inputTrackingNumber.value.trim() : '';
            if (!trackVal) {
                alert('Silakan masukkan nomor B/L atau PEB terlebih dahulu.');
                return;
            }
            executeTracking(trackVal, trackVal.startsWith('PEB') ? 'Pemberitahuan Ekspor Barang' : 'Bill of Lading (B/L)', 'UMKM Terverifikasi NusaBridge', 'MV Meratus Java V-209', 'Tanjung Priok -> Singapore Transshipment', 'Dalam Proses Logistik Terverifikasi');
        });
    }

    function executeTracking(number, type, exporter, carrier, route, statusBadge) {
        if (trackingResultBox) {
            trackingResultBox.style.display = 'block';
            document.getElementById('trackDisplayNumber').textContent = number;
            document.getElementById('trackDisplayType').textContent = type;
            document.getElementById('trackDisplayExporter').textContent = exporter;
            document.getElementById('trackDisplayCarrier').textContent = carrier;
            document.getElementById('trackDisplayRoute').textContent = route;
            document.getElementById('trackDisplayStatus').textContent = statusBadge;
        }
    }

    // --------------------------------------------------------------------------
    // 7. ROLE TAB SWITCHER
    // --------------------------------------------------------------------------
    const roleBtns = document.querySelectorAll('.role-pill-btn');
    const roleCards = document.querySelectorAll('.role-content-pane');

    roleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            roleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const targetRole = this.getAttribute('data-role');

            roleCards.forEach(pane => {
                if (pane.getAttribute('id') === `role-${targetRole}`) {
                    pane.style.display = 'block';
                } else {
                    pane.style.display = 'none';
                }
            });
        });
    });

});
