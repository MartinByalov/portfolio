var c = document.getElementById('wordCanvas');
                    var ctx = c.getContext('2d');

                    var counter = 0;

                    var imgs = ['./images/word1.png', './images/word2.png', './images/word3.png'];


                    function drawWord(){
                        
                        
                        wordImage = new Image();
                        wordImage.src = imgs[counter];

                        wordImage.onload = function(){
                            ctx.drawImage(wordImage, 0, 0, wordImage.width, wordImage.height,  
                                          0, 0, c.width, c.height);

                            
                            counter += 1;
                        }
                    }

                    drawWord();

                    document.getElementById('button1').addEventListener("click", drawWord); 