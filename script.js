const accordionGroup = document.querySelector('ion-accordion-group');
var toggleAccordion = () => {
  if (accordionGroup.value === 'second') {
    accordionGroup.value = undefined;
  } else {
    accordionGroup.value = 'second';
  }
};

  function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  }

  function getPrayerTimes(cityName, country, date) {
    var aladhanUrl = 'https://api.aladhan.com/v1/timingsByCity/' + date + '?city=' + encodeURIComponent(cityName) + '&country=' + encodeURIComponent(country);
    
    fetch(aladhanUrl)
      .then(response => response.json())
      .then(data => {
        var prayerTimes = data.data.timings;
        var prayerTimesHtml = '';
        
        if (prayerTimes) {
          prayerTimesHtml += '<ion-title>Prayer Times for ' + cityName + ', ' + country +  '</ion-title>';
          prayerTimesHtml += '<ion-grid>';
          for (var key in prayerTimes) {
            prayerTimesHtml += '<ion-row><ion-col><strong>' + key + ':</strong> </ion-col>' +'<ion-col>'+ prayerTimes[key]+'</ion-col>' + '</ion-row>';
          }
          prayerTimesHtml += '</ion-grid>';

         let con =  document.querySelector('.firstView');
         con.classList.add('none');
         console.log(con)
          // Save prayer times to local storage
          localStorage.setItem('prayerTimes', JSON.stringify(prayerTimes));
        } else {
          prayerTimesHtml = '<p>Prayer times not available for the specified city, country, and date.</p>';
        }
        
        document.getElementById('prayer-times').innerHTML = prayerTimesHtml;
      })
      .catch(error => {
        // console.error('Error fetching prayer times:', error);
        document.getElementById('prayer-times').innerHTML = error;

        
        // Retrieve prayer times from local storage
        var savedPrayerTimes = localStorage.getItem('prayerTimes');
        if (savedPrayerTimes) {
          document.getElementById('prayer-times').innerHTML = JSON.parse(savedPrayerTimes);
        } else {
          document.getElementById('prayer-times').innerHTML = '<p>Error fetching prayer times.</p>';
        }
      });
  }

  document.getElementById('fetchPrayerTimes').addEventListener('click', function() {
    var cityName = document.getElementById('cityName').value;
    var country = document.getElementById('country').value;
    var selectedDate = new Date(document.getElementById('date').value);
    var formattedDate = formatDate(selectedDate);
    console.log(cityName);
    
    if (cityName && country && formattedDate) {
      getPrayerTimes(cityName, country, formattedDate);
    } else {
      alert('Please enter city name, country, and date.');
    }
  });

