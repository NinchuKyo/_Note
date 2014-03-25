//
//  Note.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <Foundation/Foundation.h>

@interface Note : NSObject

+ (Note*) noteTitle:(NSString *) title noteWithText:(NSString*)text;

// Accessor methods
- (NSString *) getTitle;
- (NSString *) getContents;
- (NSAttributedString *) getHTMLContents;


// Mutator methods
- (void) setTitle: (NSString *) newTitle;
- (void) setContents: (NSString *) newContents;
- (void) setHTMLContents: (NSAttributedString *) newHTMLContents;

@end
