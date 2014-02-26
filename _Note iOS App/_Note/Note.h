//
//  CENote.h
//  TextKitNotepad
//
//  Created by Colin Eberhardt on 19/06/2013.
//  Copyright (c) 2013 Colin Eberhardt. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Note : NSObject

@property NSString* contents;
@property NSDate* timestamp;
@property bool setTitle;

@property NSString *titleString;

// an automatically generated not title, based on the first few words (readonly)
@property NSString* title;

+ (Note*) noteWithText:(NSString*)text;

@end
