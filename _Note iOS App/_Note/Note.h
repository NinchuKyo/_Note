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
@property NSString *htmlContentsAsString;

@property NSDate *timestamp;

@property NSString *titleString;
@property (nonatomic) NSString *title;

+ (Note*) noteTitle:(NSString *) title noteWithText:(NSString*)text;

@end
