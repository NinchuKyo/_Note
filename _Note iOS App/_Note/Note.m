//
//  Note.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "Note.h"

@implementation Note

+ (Note *) noteTitle:(NSString *) title noteWithText:(NSString *)text{
    Note* note = [Note new];
    note.contents = text;
    note.htmlContents = text;
    note.timestamp = [NSDate date];
    note.titleString = title;
    return note;
}

- (NSString *)title {
    
    /*
    // split into lines
    NSArray* lines = [self.contents componentsSeparatedByCharactersInSet: [NSCharacterSet newlineCharacterSet]];
    
    // return the first
    return lines[0];
     */
    return self.titleString;
}

@end
