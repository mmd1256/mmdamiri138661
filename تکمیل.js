document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای اصلی
    const form = document.getElementById('checkout-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.steps .step');
    const progress = document.getElementById('progress');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    let currentStep = 1;
    const totalSteps = steps.length;

    // اعتبارسنجی‌ها
    const validators = {
        fullname: {
            validate: value => value.length >= 3,
            message: 'نام و نام خانوادگی باید حداقل 3 حرف باشد'
        },
        mobile: {
            validate: value => /^09\d{9}$/.test(value),
            message: 'شماره موبایل باید 11 رقم و با 09 شروع شود'
        },
        email: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'لطفاً ایمیل معتبر وارد کنید'
        },
        'postal-code': {
            validate: value => /^\d{10}$/.test(value),
            message: 'کد پستی باید 10 رقم باشد'
        }
    };

    // مدیریت مراحل
    function updateStep(direction) {
        if (direction === 'next' && !validateStep(currentStep)) {
            shakeStep();
            return;
        }

        steps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.remove('active');

        if (direction === 'next') {
            currentStep++;
        } else {
            currentStep--;
        }

        steps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.add('active');

        updateButtons();
        updateProgress();
    }

    // بروزرسانی دکمه‌ها
    function updateButtons() {
        prevBtn.disabled = currentStep === 1;
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
        submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    }

    // بروزرسانی نوار پیشرفت
    function updateProgress() {
        const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
    }

    // اعتبارسنجی مرحله فعلی
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[id="step-${step}"]`);
        const fields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            const validator = validators[field.id];
            if (validator) {
                const isFieldValid = validator.validate(field.value);
                showFieldError(field, isFieldValid ? '' : validator.message);
                isValid = isValid && isFieldValid;
            } else if (!field.value.trim()) {
                showFieldError(field, 'این فیلد الزامی است');
                isValid = false;
            }
        });

        return isValid;
    }

    // نمایش خطای فیلد
    function showFieldError(field, message) {
        const errorElement = field.parentElement.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
        field.classList.toggle('invalid', Boolean(message));
    }

    // انیمیشن لرزش برای خطا
    function shakeStep() {
        const currentStepElement = steps[currentStep - 1];
        currentStepElement.classList.add('shake');
        setTimeout(() => {
            currentStepElement.classList.remove('shake');
        }, 500);
    }

    // مدیریت شماره کارت
    const cardInputs = document.querySelectorAll('.card-segment');
    cardInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length === 4 && index < cardInputs.length - 1) {
                cardInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                cardInputs[index - 1].focus();
            }
        });
    });

    // مدیریت تاریخ انقضا
    const expireDate = document.getElementById('expire-date');
    expireDate.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            const month = value.slice(0, 2);
            const year = value.slice(2, 4);
            
            if (parseInt(month) > 12) {
                value = '12' + year;
            }
            
            this.value = `${month}/${year}`;
        } else {
            this.value = value;
        }
    });

    // رویدادها
    prevBtn.addEventListener('click', () => updateStep('prev'));
    nextBtn.addEventListener('click', () => updateStep('next'));

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            shakeStep();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال پردازش...';

        // شبیه‌سازی ارسال فرم
        setTimeout(() => {
            const trackingCode = Math.random().toString(36).substr(2, 9).toUpperCase();
            document.getElementById('tracking-code').textContent = trackingCode;
            
            form.style.display = 'none';
            document.querySelector('.success-message').style.display = 'block';
        }, 2000);
    });

    // اعتبارسنجی آنی فیلدها
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.required) {
                const validator = validators[this.id];
                if (validator) {
                    const isValid = validator.validate(this.value);
                    showFieldError(this, isValid ? '' : validator.message);
                }
            }
        });
    });
});



// دیتابیس استان‌ها و شهرها
const iranStates = {
    "آذربایجان شرقی": ["تبریز", "مراغه", "میانه", "شبستر", "بناب", "جلفا", "سراب", "هشترود", "آذرشهر", "اسکو", "کلیبر", "هریس", "مرند", "ملکان", "بستان‌آباد", "ورزقان", "اهر", "خداآفرین", "چاراویماق", "عجب‌شیر"],
    
    "آذربایجان غربی": ["ارومیه", "خوی", "میاندوآب", "مهاباد", "سلماس", "نقده", "بوکان", "پیرانشهر", "سردشت", "تکاب", "اشنویه", "ماکو", "شاهین‌دژ", "چالدران", "پلدشت", "چایپاره", "شوط"],
    
    "اردبیل": ["اردبیل", "پارس‌آباد", "مشگین‌شهر", "خلخال", "گرمی", "نمین", "نیر", "کوثر", "بیله‌سوار", "سرعین"],
    
    "اصفهان": ["اصفهان", "کاشان", "خمینی‌شهر", "نجف‌آباد", "شاهین‌شهر", "شهرضا", "فلاورجان", "لنجان", "مبارکه", "فریدن", "فریدون‌شهر", "گلپایگان", "نائین", "آران و بیدگل", "اردستان", "خوانسار", "سمیرم", "دهاقان", "نطنز", "تیران و کرون", "بوئین و میاندشت", "چادگان", "خور و بیابانک", "برخوار"],
    
    "البرز": ["کرج", "ساوجبلاغ", "نظرآباد", "فردیس", "اشتهارد", "طالقان"],
    
    "ایلام": ["ایلام", "دهلران", "آبدانان", "دره‌شهر", "ایوان", "شیروان و چرداول", "مهران", "ملکشاهی", "سیروان", "بدره"],
    
    "بوشهر": ["بوشهر", "دشتستان", "کنگان", "گناوه", "دشتی", "جم", "دیر", "تنگستان", "دیلم", "عسلویه"],
    
    "تهران": ["تهران", "شهریار", "اسلامشهر", "بهارستان", "پاکدشت", "ری", "قدس", "رباط‌کریم", "ورامین", "قرچک", "پردیس", "دماوند", "پیشوا", "فیروزکوه", "ملارد", "شمیرانات"],
    
    "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "فارسان", "لردگان", "اردل", "کیار", "سامان", "بن", "کوهرنگ", "خانمیرزا"],
    
    "خراسان جنوبی": ["بیرجند", "قائنات", "طبس", "فردوس", "نهبندان", "سرایان", "سربیشه", "زیرکوه", "درمیان", "بشرویه", "خوسف"],
    
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "کاشمر", "قوچان", "تربت جام", "تایباد", "چناران", "سرخس", "گناباد", "فریمان", "خواف", "درگز", "خلیل‌آباد", "بردسکن", "رشتخوار", "جوین", "جغتای", "فیروزه", "کلات", "بجستان", "زاوه", "مه‌ولات", "صالح‌آباد", "باخرز", "داورزن"],
    
    "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین", "فاروج", "مانه و سملقان", "جاجرم", "گرمه", "راز و جرگلان"],
    
    "خوزستان": ["اهواز", "دزفول", "آبادان", "بندر ماهشهر", "اندیمشک", "خرمشهر", "شوش", "شوشتر", "مسجدسلیمان", "بهبهان", "ایذه", "شادگان", "رامهرمز", "باغ‌ملک", "امیدیه", "هندیجان", "لالی", "رامشیر", "گتوند", "اندیکا", "هفتکل", "هویزه", "آغاجاری", "کارون", "حمیدیه", "باوی"],
    
    "زنجان": ["زنجان", "ابهر", "خدابنده", "ماه‌نشان", "خرمدره", "طارم", "ایجرود", "سلطانیه"],
    
    "سمنان": ["سمنان", "شاهرود", "دامغان", "گرمسار", "مهدی‌شهر", "میامی", "آرادان", "سرخه"],
    
    "سیستان و بلوچستان": ["زاهدان", "چابهار", "خاش", "سراوان", "زابل", "ایرانشهر", "نیک‌شهر", "سرباز", "کنارک", "زهک", "دلگان", "هیرمند", "قصرقند", "فنوج", "مهرستان", "میرجاوه", "نیمروز", "هامون", "سیب و سوران"],
    
    "فارس": ["شیراز", "مرودشت", "جهرم", "فسا", "کازرون", "لارستان", "فیروزآباد", "داراب", "اقلید", "آباده", "لامرد", "نی‌ریز", "استهبان", "گراش", "کوار", "رستم", "خرامه", "سروستان", "زرین‌دشت", "قیروکارزین", "خنج", "بوانات", "ارسنجان", "مهر", "پاسارگاد", "خرم‌بید", "سپیدان", "ممسنی", "فراشبند", "بختگان"],
    
    "قزوین": ["قزوین", "تاکستان", "آبیک", "بوئین‌زهرا", "البرز", "آوج"],
    
    "قم": ["قم"],
    
    "کردستان": ["سنندج", "سقز", "قروه", "بانه", "مریوان", "بیجار", "کامیاران", "دیواندره", "دهگلان", "سروآباد"],
    
    "کرمان": ["کرمان", "رفسنجان", "سیرجان", "جیرفت", "بم", "زرند", "راور", "عنبرآباد", "بافت", "کهنوج", "شهربابک", "منوجان", "رودبار جنوب", "قلعه‌گنج", "فهرج", "نرماشیر", "ریگان", "فاریاب", "رابر", "ارزوئیه", "بردسیر", "انار", "نوق"],
    
    "کرمانشاه": ["کرمانشاه", "اسلام‌آباد غرب", "سرپل ذهاب", "هرسین", "سنقر", "کنگاور", "قصر شیرین", "گیلانغرب", "پاوه", "روانسر", "دالاهو", "صحنه", "جوانرود", "ثلاث باباجانی"],
    
    "کهگیلویه و بویراحمد": ["یاسوج", "گچساران", "دهدشت", "دوگنبدان", "سی‌سخت", "دنا", "باشت", "لنده", "چرام", "بهمئی"],
    
    "گلستان": ["گرگان", "گنبد کاووس", "علی‌آباد", "آق‌قلا", "کردکوی", "کلاله", "آزادشهر", "رامیان", "مینودشت", "ترکمن", "گمیشان", "گالیکش", "مراوه‌تپه", "بندر گز"],
    
    "گیلان": ["رشت", "لاهیجان", "بندر انزلی", "آستارا", "لنگرود", "رودسر", "تالش", "صومعه‌سرا", "آستانه اشرفیه", "رودبار", "فومن", "شفت", "ماسال", "سیاهکل", "رضوانشهر", "املش"],
    
    "لرستان": ["خرم‌آباد", "بروجرد", "دورود", "الیگودرز", "کوهدشت", "ازنا", "پلدختر", "دلفان", "سلسله", "رومشکان", "دوره"],
    
    "مازندران": ["ساری", "بابل", "آمل", "قائم‌شهر", "بهشهر", "تنکابن", "نوشهر", "چالوس", "نکا", "محمودآباد", "بابلسر", "رامسر", "جویبار", "نور", "فریدونکنار", "گلوگاه", "میاندورود", "عباس‌آباد", "سیمرغ", "کلاردشت", "سوادکوه", "سوادکوه شمالی"],
    
    "مرکزی": ["اراک", "ساوه", "خمین", "محلات", "دلیجان", "کمیجان", "شازند", "آشتیان", "تفرش", "فراهان", "خنداب", "زرندیه"],
    
    "هرمزگان": ["بندرعباس", "میناب", "بندر لنگه", "قشم", "رودان", "جاسک", "پارسیان", "حاجی‌آباد", "بستک", "سیریک", "بشاگرد", "ابوموسی", "خمیر"],
    
    "همدان": ["همدان", "ملایر", "نهاوند", "اسدآباد", "تویسرکان", "رزن", "کبودرآهنگ", "بهار", "فامنین", "درگزین"],
    
    "یزد": ["یزد", "میبد", "اردکان", "ابرکوه", "بافق", "مهریز", "خاتم", "اشکذر", "تفت", "بهاباد"]
};

// تابع راه‌اندازی استان‌ها و شهرها
function initializeLocationSelectors() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');

    // اضافه کردن استان‌ها
    for (const state in iranStates) {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        provinceSelect.appendChild(option);
    }

    // رویداد تغییر استان
    provinceSelect.addEventListener('change', function() {
        // پاک کردن لیست قبلی شهرها
        citySelect.innerHTML = '<option value="">لطفا شهر را انتخاب کنید</option>';
        
        // غیرفعال کردن انتخاب شهر اگر استانی انتخاب نشده باشد
        citySelect.disabled = !this.value;

        // اضافه کردن شهرهای استان انتخاب شده
        if (this.value) {
            iranStates[this.value].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    });

    // اعتبارسنجی انتخاب استان و شهر
    provinceSelect.addEventListener('invalid', function() {
        this.setCustomValidity('لطفاً استان را انتخاب کنید');
    });

    provinceSelect.addEventListener('change', function() {
        this.setCustomValidity('');
    });

    citySelect.addEventListener('invalid', function() {
        this.setCustomValidity('لطفاً شهر را انتخاب کنید');
    });

    citySelect.addEventListener('change', function() {
        this.setCustomValidity('');
    });
}

// فراخوانی تابع راه‌اندازی هنگام لود صفحه
document.addEventListener('DOMContentLoaded', initializeLocationSelectors);


// اضافه کردن کلاس‌های انیمیشن به المان‌ها
function addAnimations() {
    // انیمیشن برای تغییر مرحله
    function animateStep(direction) {
        const currentStep = document.querySelector('.form-step.active');
        currentStep.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
    }

    // انیمیشن برای اعتبارسنجی موفق
    function animateValidInput(input) {
        input.classList.add('valid-input');
        setTimeout(() => {
            input.classList.remove('valid-input');
        }, 1500);
    }

    // انیمیشن برای دکمه در حال پردازش
    function animateLoadingButton(button) {
        button.classList.add('btn-loading');
        button.disabled = true;
    }

    // انیمیشن برای هایلایت فیلدها
    function animateHighlight(element) {
        element.classList.add('highlight');
        element.addEventListener('animationend', () => {
            element.classList.remove('highlight');
        });
    }
}

// مثال استفاده:
document.querySelector('.btn').addEventListener('click', function() {
    animateLoadingButton(this);
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('valid', () => {
        animateValidInput(input);
    });
});
