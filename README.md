# Genetic-Algorithm-Elaboration

The project tackles the genetic algorithm in a simple manner, by taking in handwritten numbers from the user & proceeds to guess what the user writes afterwards.
For simplicity purposes, there are 5 numbers, going from 0 to 4, to not bore the user. 

#Training-Phase
Through the training phase, the user draws the same number, 3 times, to enhance accuracy. With every input the application saves the pattern of each number for 
the guessing phase. 

#Guessing-Phase
Following training the application, here's where the fun part starts. The application ask of the user to draw a number. As the user submits his input, the application
guesses which number has been drawn by finding the difference between the given guess value & all other numbers' value to find which is the most accurate.
A lot of computations later, results show which number is the fittest. 
If the application has guessed right, the application moves on to the next guess, whereas if it has missed, the user chooses the number corresponding to his
guess, and the application will consider the pattern for later guesses.
