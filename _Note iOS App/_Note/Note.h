//
//  Note.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <Foundation/Foundation.h>

@interface Note : NSObject

@property NSString *contents;
@property NSAttributedString *htmlContents;
@property NSDate *timestamp;

@property NSString *titleString;

// an automatically generated not title, based on the first few words (readonly)
@property NSString *title;

+ (Note*) noteTitle:(NSString *) title noteWithText:(NSString*)text;

@end
