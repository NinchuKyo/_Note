//
//  Note.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "Note.h"

@implementation Note

+ (Note *)noteWithText:(NSString *)text {
    Note* note = [Note new];
    note.contents = text;
    note.timestamp = [NSDate date];
    note.setTitle = NO;
    note.titleString = @"";
    return note;
}

- (NSString *)title {
    
    // split into lines
    NSArray* lines = [self.contents componentsSeparatedByCharactersInSet: [NSCharacterSet newlineCharacterSet]];
    
    // return the first
    return lines[0];
}

@end
