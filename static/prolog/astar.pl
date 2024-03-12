% =================================================================================================
%
%   A* Algorithm
%
% =================================================================================================



% heuristic(+From, +To, -Heuristic)
% function that returns the heuristic distance between two points
heuristic([X1, Y1], [X2, Y2], Heuristic) :-
    Heuristic is abs(X1 - X2) + abs(Y1 - Y2).
/*
Example:
?- heuristic([1, 0], [3, 0], H).
H = 2.
*/



% astar(+Start, +Target, +AllowedPoints, -Path)
% Move only on visited tiles
% Create minimum possible amount of additional predicates
astar(Start, Target, AllowedPoints, Path) :-
    member(Start, AllowedPoints),
    astar_helper(Start, Target, [Target | AllowedPoints], [Start], Path), !.
/*
Example:
?- astar([0, 0], [1, 1], [[0, 0], [1, 0], [1, 1]], Path)..
Path = [[0, 0], [1, 0], [1, 1]].
*/



% astar_helper(+Start, +Target, +AllowedPoints, +CurrentPath, -Path)
% Helper function for astar
astar_helper(Start, Start, _, Path, Path) :- !.
astar_helper(Start, Target, _, CurrentPath, Path) :- 
    adjacent(Start, AdjacentList),
    member(Target, AdjacentList),
    append(CurrentPath, [Target], Path), !.
astar_helper(Start, Target, AllowedPoints, CurrentPath, Path) :-
    astar_step(Start, Target, AllowedPoints, CurrentPath, Adjacent),
    append(CurrentPath, [Adjacent], NewPath),
    astar_helper(Adjacent, Target, AllowedPoints, NewPath, Path).



% astar_step(+Start, +Target, +AllowedPoints, +CurrentPath, -NextPoint)
% Function that returns the next point in the path
astar_step(Start, Start, _, _, Start) :- !.
astar_step(Start, Target, AllowedPoints, CurrentPath, NextPoint) :-
    adjacent(Start, AdjacentList),
    member(NextPoint, AdjacentList),
    member(NextPoint, AllowedPoints),
    not(member(NextPoint, CurrentPath)),
    heuristic(NextPoint, Target, Heuristic),
    not((member(OtherAdjacent, AdjacentList), member(OtherAdjacent, AllowedPoints), not(member(OtherAdjacent, CurrentPath)), heuristic(OtherAdjacent, Target, OtherHeuristic), Heuristic > OtherHeuristic)).

