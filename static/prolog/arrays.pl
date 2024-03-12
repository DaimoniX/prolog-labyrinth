% =================================================================================================
%
%   Arrays and Matrices manipulation
%
% =================================================================================================



% get_array_val(++Array, +Index, -Result)
% Get the value of array at a given position
get_array_val(Array, Index, Result) :-
    nth0(Index, Array, Result).
/*
Example:
?- get_array_val([0, 1, 2, 3], 2, Result).
Result = 2.
*/



% set_array_val(++Array, +Index, +Value, -Result)
% Set the value of array at a given position
set_array_val(Array, Index, Value, Result) :-
    nth0(Index, Array, _, Temp),
    nth0(Index, Result, Value, Temp).
/*
Example:
?- set_array_val([0, 1, 2, 3], 2, 7, Result).
Result = [0, 1, 7, 3].
*/



% get_2d_val(++Matrix, ++Point, -Result)
% Get the value of a 2D matrix at a given position
get_2d_val(Matrix, [X, Y], Result) :-
    nth0(Y, Matrix, Row),
    nth0(X, Row, Result).
/*
Example:
?- get_2d_val([[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], Result).
Result = [1, 1].
*/



% Set the value of a 2D matrix at a given position
% Ex. Matrix: [[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], [7, 7], Result
% Result = [[[0, 0], [1, 0]], [[0, 1], [7, 7]]]
set_2d_val(Matrix, [X, Y], Value, Result) :-
    nth0(X, Matrix, Row),
    set_array_val(Row, Y, Value, Temp),
    set_array_val(Matrix, X, Temp, Result).
/*
Example:
?- set_2d_val([[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], [7, 7], Result).
Result = [[[0, 0], [1, 0]], [[0, 1], [7, 7]]].
*/
