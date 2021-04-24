$(() => {
    if($('.prevScreenshots').length > 0){
        let isDown = false;
        let startX;
        let scrollLeft;


        $('.prevScreenshots')
            .on('mousedown', function(e){
                isDown = true;
                startX = e.pageX - $(this).offset().left;
                scrollLeft = $(this).scrollLeft();
            })
            .on('mousemove', function(e){
                e.preventDefault();
                if(!isDown) return;
                let x = e.pageX - $(this).offset().left;
                let walk = (x - startX) * 2;
                $(this).scrollLeft(scrollLeft - walk);
            })
            .on('mouseup', (e) => isDown = false)
            .on('mouseleave', (e) => isDown = false);
    }else{
        let mediaControls = (mediaFile) => {
            let file = $(`#${mediaFile}`)[0]

            console.log(file)

            let toggleVideoStatus = () => {
                if(file.paused){
                    file.play();
                }else{
                    file.pause();
                }
            }

            let updatePlayIcon = () => {
                if(file.paused){
                    $('#play').html(`<i class="fas fa-play"></i>`);
                }else{
                    $('#play').html(`<i class="fas fa-pause"></i>`);
                }
            }

            let updateProgress = () => {
                $('#progress').val((file.currentTime / file.duration) * 100);
                let mins = Math.floor(file.currentTime / 60);
                if(mins < 10) mins = '0'+String(mins);
                let secs = Math.floor(file.currentTime % 60);
                if(secs < 10) secs = '0'+String(secs);

                $('#timestamp').html(`${mins}:${secs}`);
            }

            let setVideoProgress = () => file.currentTime = (parseInt($('#progress').val()) * file.duration) / 100;

            let stopVideo = () => {
                file.currentTime = 0;
                file.pause();
            }

            $(file)
                .on('play', updatePlayIcon)
                .on('click', toggleVideoStatus)
                .on('pause', updatePlayIcon)
                .on('timeupdate', updateProgress);

            $('#play').on('click', toggleVideoStatus);
            $('#stop').on('click', stopVideo);

            $('#progress').on('change', setVideoProgress);

            if(mediaFile == "audioFile"){
                $('#audioThumb')
                    .on('play', updatePlayIcon)
                    .on('click', toggleVideoStatus)
                    .on('pause', updatePlayIcon)
                    .on('timeupdate', updateProgress);
            }
        }

        mediaControls($('.controls').attr('data-control'))
    }
})