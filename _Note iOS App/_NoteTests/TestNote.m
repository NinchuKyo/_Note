//
//  TestNote.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//
//  Unit tests for Note.m
//

#import "QUnit.h"
#import "Note.h"
#import "TestNote.h"

@implementation TestNote

- (void)testNilTitle
{
    Note *newNote = [Note noteTitle:nil noteWithText:nil];
    
    equal(newNote.getTitle, @"", @"Title of notes should be empty")
    equal(newNote.getContents, @"", @"Contents of note is empty")
    
}

- (void)testInvalidTitle
{
    // Test assortment of symbols
    Note *newNote= [Note noteTitle:@"&@So(*#meRandomNote&(@*&" noteWithText:@"This note contains symbols"];
    equal(newNote.getTitle, @"SomeRandomNote", @"Symbolic characters are replaced with \"\"");
    
    // Test underscored titles
    [newNote setTitle: @"_UnderscoreTitle"];
    equal(newNote.getTitle, @"_UnderscoreTitle", @"_'s are not replaced");
    
    // Test hyphenated titles
    [newNote setTitle: @"Hyphen-Title"];
    equal(newNote.getTitle, @"Hyphen-Title", @"-'s are not replaced");
    
    // Test titles containing spaces
    [newNote setTitle:@"Space Note"];
    equal(newNote.getTitle, @"Space Note", @"Spaces are not replaced");
    
    // Test titles containing only spaces
    [newNote setTitle:@"    "];
    equal(newNote.getTitle, @"    ", @"Spaces are not replaced, even blocks of contiguous space")
    
}

- (void)testInvalidHTMLFormat
{
    NSString *invalidHTMLString = @"<p>This is an improper html string <> <<<<";
    Note *newNote = [Note noteTitle:@"Invalid HTML Title" noteWithText:invalidHTMLString];
    
    equal(newNote.getContents, invalidHTMLString, @"Contents of note should still be the same");
    
}

- (void)testChangingTitle
{
    Note *newNote = [Note noteTitle:@"Old Title" noteWithText:@"This is the content"];
    equal(newNote.getTitle, @"Old Title", @"Titles should be the same");
    
    [newNote setTitle:@"New Title"];
    
    equal(newNote.getTitle, @"New Title", @"Titles should be the same");
    equal(newNote.getContents, @"This is the content", @"Contents should not change");
}

- (void)testChangingContent
{
    Note *newNote = [Note noteTitle:@"Title" noteWithText:@"This is the old content"];
    equal(newNote.getContents, @"This is the old content", @"Content should be the same");
    
    [newNote setContents:@"This is the new content"];
    
    equal(newNote.getContents, @"This is the new content", @"Content should be the same");
    equal(newNote.getTitle, @"Title", @"The title should not change");
}

@end
