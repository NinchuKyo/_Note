//
//  TestNote.m
//  _Note
//
//  Created by David Nguyen on 3/17/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import "QUnit.h"
#import "Note.h"
#import "TestNote.h"

@implementation TestNote

- (void)testNilTitle
{
    Note *newNote = [Note noteTitle:nil noteWithText:nil];
    
    equal(newNote.title, @"", @"Title of note is empty")
    equal(newNote.contents, @"", @"Contents of note is empty")
    
}

- (void)testInvalidTitle
{
    Note *newNote= [Note noteTitle:@"&@So(*#meRandomNote&(@*&" noteWithText:@"This note contains symbols"];
    equal(newNote.title, @"RandomNote", @"Symbolic characters are replaced with \"\"");
    
    newNote.title = @"_UnderscoreTitle";
    equal(newNote.title, @"_UnderscoreTitle", @"_'s are not replaced");
    
    newNote.title = @"Hyphen-Title";
    equal(newNote.title, @"Hyphen-Title", @"-'s are not replaced");
    
}

- (void)testInvalidHTMLFormat
{
    NSString *invalidHTMLString = @"<p>This is an improper html string <> <<<<";
    Note *newNote = [Note noteTitle:@"Invalid HTML Title" noteWithText:invalidHTMLString];
    
    equal(newNote.contents, invalidHTMLString, @"Contents of note should still be the same");
    
}

@end
